/**
 * Cross-vehicle recall aggregation — powers the /recalls/most-recalled-cars
 * data-study page. This is the site's first page that aggregates NHTSA data
 * ACROSS many models rather than decoding a single VIN, which is where the
 * unique "information gain" (and link-worthiness) lives.
 *
 * Data source: the same NHTSA Recalls API the rest of the site uses
 * (make+model+year → recall campaigns). There is no make- or model-level
 * aggregate endpoint, so we sum over a curated set of high-volume US models
 * across recent model years and dedupe campaigns by NHTSA campaign number.
 *
 * Cost control: this runs at build / weekly-ISR time only (not per request),
 * and fetches are run in small concurrency batches so the 2-CPU VPS isn't
 * hammered. Every call is independently Next-fetch-cached by getRecalls, so
 * repeat regenerations are cheap.
 */

import { getRecalls, type RecallResult } from "./nhtsa";
import { slugify } from "./utils";

/** Curated set of high-volume US-market models we rank. Make/model strings
 *  mirror NHTSA's naming (same shape the homepage recall seeds use). */
export const RANKED_MODELS: { make: string; model: string }[] = [
  { make: "Toyota", model: "RAV4" },
  { make: "Toyota", model: "Camry" },
  { make: "Toyota", model: "Corolla" },
  { make: "Toyota", model: "Highlander" },
  { make: "Toyota", model: "Tacoma" },
  { make: "Ford", model: "F-150" },
  { make: "Ford", model: "Explorer" },
  { make: "Ford", model: "Escape" },
  { make: "Ford", model: "Mustang" },
  { make: "Chevrolet", model: "Silverado 1500" },
  { make: "Chevrolet", model: "Equinox" },
  { make: "Chevrolet", model: "Tahoe" },
  { make: "Chevrolet", model: "Malibu" },
  { make: "Honda", model: "CR-V" },
  { make: "Honda", model: "Civic" },
  { make: "Honda", model: "Accord" },
  { make: "Honda", model: "Pilot" },
  { make: "Nissan", model: "Rogue" },
  { make: "Nissan", model: "Altima" },
  { make: "Nissan", model: "Sentra" },
  { make: "Jeep", model: "Grand Cherokee" },
  { make: "Jeep", model: "Wrangler" },
  { make: "Jeep", model: "Cherokee" },
  { make: "Ram", model: "1500" },
  { make: "GMC", model: "Sierra 1500" },
  { make: "Hyundai", model: "Tucson" },
  { make: "Hyundai", model: "Elantra" },
  { make: "Hyundai", model: "Santa Fe" },
  { make: "Kia", model: "Sportage" },
  { make: "Kia", model: "Telluride" },
  { make: "Subaru", model: "Outback" },
  { make: "Subaru", model: "Forester" },
  { make: "Tesla", model: "Model Y" },
  { make: "Tesla", model: "Model 3" },
  { make: "Dodge", model: "Charger" },
  { make: "Dodge", model: "Durango" },
];

/** Recent model years to aggregate over. Brand-new years have few recalls
 *  yet and pre-2021 cars are less relevant to today's buyers. */
export const RANKED_YEARS = [2021, 2022, 2023, 2024, 2025];

export interface RecalledModelStat {
  make: string;
  model: string;
  makeSlug: string;
  modelSlug: string;
  /** Distinct NHTSA recall campaigns affecting RANKED_YEARS of this model. */
  campaigns: number;
  /** Sum of PotentialNumberofUnitsAffected across those distinct campaigns. */
  unitsAffected: number;
  /** Most common recall component group (e.g. "air bags", "electrical"). */
  topComponent: string;
  /** Most recent recall report date across the campaigns (ISO-ish raw). */
  latestDate: string;
  /** Year with a cached/known recall, used to deep-link a real year hub. */
  linkYear: string;
}

export interface MostRecalledData {
  rows: RecalledModelStat[];
  totalCampaigns: number;
  totalUnits: number;
  modelsCovered: number;
  yearsCovered: number[];
  generatedYears: string;
}

/** Run async tasks with bounded concurrency so we don't open hundreds of
 *  sockets to NHTSA at once on a 2-CPU box. */
async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

function topComponentOf(recalls: RecallResult[]): string {
  const counts = new Map<string, number>();
  for (const r of recalls) {
    if (!r.Component) continue;
    const key = r.Component.split(":")[0].trim().toLowerCase();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let best = "";
  let bestN = 0;
  for (const [k, n] of counts) {
    if (n > bestN) {
      best = k;
      bestN = n;
    }
  }
  return best;
}

/**
 * Aggregate distinct recall campaigns per ranked model across RANKED_YEARS.
 * Each model fans out one getRecalls call per year (Next-cached); campaigns
 * are deduped by NHTSACampaignNumber so a multi-year campaign counts once.
 */
export async function getMostRecalledModels(): Promise<MostRecalledData> {
  const rows = await mapPool(RANKED_MODELS, 6, async ({ make, model }) => {
    // Weekly fetch TTL: this page aggregates ~175 calls, so keep them cached
    // for a week. Next derives the route revalidate from the min fetch TTL,
    // so this also makes the whole page regenerate weekly rather than hourly.
    const perYear = await mapPool(RANKED_YEARS, 3, (y) =>
      getRecalls(make, model, y, 604800).catch(() => [] as RecallResult[]),
    );
    const byCampaign = new Map<string, RecallResult>();
    for (const list of perYear) {
      for (const r of list) {
        if (r.NHTSACampaignNumber && !byCampaign.has(r.NHTSACampaignNumber)) {
          byCampaign.set(r.NHTSACampaignNumber, r);
        }
      }
    }
    const unique = Array.from(byCampaign.values());
    const unitsAffected = unique.reduce(
      (sum, r) => sum + (Number(r.PotentialNumberofUnitsAffected) || 0),
      0,
    );
    let latestDate = "";
    let latestTime = 0;
    let linkYear = String(RANKED_YEARS[RANKED_YEARS.length - 1]);
    for (const r of unique) {
      const t = new Date(r.ReportReceivedDate).getTime() || 0;
      if (t > latestTime) {
        latestTime = t;
        latestDate = r.ReportReceivedDate;
      }
      if (r.ModelYear && /^\d{4}$/.test(r.ModelYear)) linkYear = r.ModelYear;
    }
    const stat: RecalledModelStat = {
      make,
      model,
      makeSlug: slugify(make),
      modelSlug: slugify(model),
      campaigns: unique.length,
      unitsAffected,
      topComponent: topComponentOf(unique),
      latestDate,
      linkYear,
    };
    return stat;
  });

  rows.sort(
    (a, b) => b.campaigns - a.campaigns || b.unitsAffected - a.unitsAffected,
  );

  const withData = rows.filter((r) => r.campaigns > 0);
  return {
    rows: withData,
    totalCampaigns: withData.reduce((s, r) => s + r.campaigns, 0),
    totalUnits: withData.reduce((s, r) => s + r.unitsAffected, 0),
    modelsCovered: withData.length,
    yearsCovered: RANKED_YEARS,
    generatedYears: `${RANKED_YEARS[0]}–${RANKED_YEARS[RANKED_YEARS.length - 1]}`,
  };
}
