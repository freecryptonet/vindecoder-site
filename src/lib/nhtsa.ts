/**
 * NHTSA API integration — minimal day-2 surface.
 *
 * Currently exposes only the recall fetcher used by the homepage strip.
 * Will grow to cover all 7 NHTSA endpoints (vPIC, recalls, complaints,
 * safety ratings, investigations, mfr communications, Canadian specs)
 * as days 3-4 wire VIN result + year pages.
 */

const RECALLS_BASE = "https://api.nhtsa.gov/recalls/recallsByVehicle";

export interface RecallResult {
  NHTSACampaignNumber: string;
  NHTSAActionNumber?: string;
  ReportReceivedDate: string;
  Component: string;
  Summary: string;
  Consequence: string;
  Remedy: string;
  Notes?: string;
  Manufacturer: string;
  ModelYear: string;
  Make: string;
  Model: string;
  PotentialNumberofUnitsAffected?: number;
  parkIt?: boolean;
  parkOutSide?: boolean;
  overTheAirUpdate?: boolean;
}

interface FetchOpts {
  /** Cache TTL in seconds for Next's data cache. Default 3600 (1h). */
  revalidate?: number;
}

async function fetchJson<T>(url: string, opts: FetchOpts = {}): Promise<T> {
  const revalidate = opts.revalidate ?? 3600;
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { next: { revalidate } });
      if (!res.ok) throw new Error(`NHTSA ${res.status} ${res.statusText}`);
      return (await res.json()) as T;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

export async function getRecalls(
  make: string,
  model: string,
  modelYear: string | number,
): Promise<RecallResult[]> {
  const url = `${RECALLS_BASE}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(
    model,
  )}&modelYear=${encodeURIComponent(String(modelYear))}`;
  try {
    const data = await fetchJson<{ results: RecallResult[] }>(url);
    return data.results ?? [];
  } catch {
    return [];
  }
}

/**
 * Cross-make recent-recalls fetcher used by the homepage strip.
 *
 * NHTSA's free `/recalls/recallsByVehicle` requires make + model + modelYear,
 * so to surface "what's recent" without a DB-backed feed, we sweep a curated
 * list of high-volume US-market vehicles for the last two model years, then
 * dedupe by campaign number and sort by ReportReceivedDate descending.
 *
 * Trade-off: a hot recall on a model not in the seed list won't surface here.
 * That's acceptable for the homepage tease — the make/model/year hubs (built
 * day 4+) will show every campaign for any vehicle. For now this gets real,
 * fresh NHTSA data on the homepage with no DB and no cron.
 */
const HOME_RECALL_SEEDS: { make: string; model: string }[] = [
  { make: "Ford", model: "F-150" },
  { make: "Chevrolet", model: "Silverado 1500" },
  { make: "Ram", model: "1500" },
  { make: "Toyota", model: "RAV4" },
  { make: "Toyota", model: "Camry" },
  { make: "Honda", model: "CR-V" },
  { make: "Honda", model: "Civic" },
  { make: "Tesla", model: "Model Y" },
  { make: "Hyundai", model: "Tucson" },
  { make: "Kia", model: "Sportage" },
  { make: "Jeep", model: "Grand Cherokee" },
  { make: "Nissan", model: "Rogue" },
];

export async function getHomepageRecentRecalls(limit = 5): Promise<RecallResult[]> {
  const now = new Date();
  const years = [now.getFullYear(), now.getFullYear() - 1];
  const calls = HOME_RECALL_SEEDS.flatMap((v) =>
    years.map((y) => getRecalls(v.make, v.model, y)),
  );
  const allLists = await Promise.all(calls);
  const seen = new Set<string>();
  const flat: RecallResult[] = [];
  for (const list of allLists) {
    for (const r of list) {
      if (!r.NHTSACampaignNumber || seen.has(r.NHTSACampaignNumber)) continue;
      seen.add(r.NHTSACampaignNumber);
      flat.push(r);
    }
  }
  flat.sort((a, b) => {
    const da = new Date(a.ReportReceivedDate).getTime() || 0;
    const db = new Date(b.ReportReceivedDate).getTime() || 0;
    return db - da;
  });
  return flat.slice(0, limit);
}
