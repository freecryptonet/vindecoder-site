/**
 * NHTSA + EPA integration layer.
 *
 * All fetches go through `fetchJson`/`fetchText` with optional Next-fetch
 * caching (default 1h). The 2 MB Next data-cache cap is the main hazard:
 * vehicleId/byYmmt and details payloads can exceed it for popular models,
 * so those callers pass `noNextCache: true` and rely on the DB cache layer.
 */

const VPIC_BASE = "https://vpic.nhtsa.dot.gov/api/vehicles";
const RECALLS_BASE = "https://api.nhtsa.gov/recalls/recallsByVehicle";
const COMPLAINTS_BASE = "https://api.nhtsa.gov/complaints/complaintsByVehicle";
const RATINGS_BASE = "https://api.nhtsa.gov/SafetyRatings";
const VEHICLES_BY_YMMT = "https://api.nhtsa.gov/vehicles/byYmmt";
const VEHICLE_DETAILS = "https://api.nhtsa.gov/vehicles";
const EPA_BASE = "https://www.fueleconomy.gov/ws/rest/vehicle";

// ============================================================
// Types
// ============================================================

export interface VinDecodeResult {
  vin: string;
  make: string;
  model: string;
  modelYear: string;
  trim: string;
  bodyClass: string;
  vehicleType: string;
  driveType: string;
  fuelTypePrimary: string;
  engineCylinders: string;
  engineDisplacementL: string;
  engineHP: string;
  transmissionStyle: string;
  doors: string;
  seats: string;
  series: string;
  manufacturer: string;
  plantCity: string;
  plantState: string;
  plantCountry: string;
  gvwr: string;
  errorCode: string;
  errorText: string;
  allFields: Record<string, string>;
}

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

export interface ComplaintResult {
  odiNumber: number;
  dateOfIncident: string;
  dateComplaintFiled: string;
  components: string;
  summary: string;
  crash: boolean;
  fire: boolean;
  numberOfInjuries: number;
  numberOfDeaths: number;
  vin: string;
  products: { productYear: string; productMake: string; productModel: string }[];
}

export interface SafetyRatingResult {
  VehicleId: number;
  VehicleDescription: string;
  OverallRating: string;
  OverallFrontCrashRating: string;
  FrontCrashDriversideRating: string;
  FrontCrashPassengersideRating: string;
  OverallSideCrashRating: string;
  SideCrashDriversideRating: string;
  SideCrashPassengersideRating: string;
  RolloverRating: string;
  SidePoleCrashRating: string;
  ComplaintsCount: number;
  RecallsCount: number;
  InvestigationCount: number;
}

export interface InvestigationResult {
  investigationNumber: string;
  nhtsaId: string;
  subject: string;
  description: string;
  openDate: string;
  latestActivityDate: string;
  status: string;
  investigationType: string;
}

export interface MfrCommResult {
  mfrCommId: string;
  date: string;
  subject: string;
  component: string;
  summary: string;
}

export interface EpaTrim {
  id: string;
  description: string;
  cityMpg: number;
  highwayMpg: number;
  combinedMpg: number;
  fuelType: string;
  co2: number;
  annualFuelCost: number;
  displacementL: string;
  cylinders: string;
  transmission: string;
}

export interface EpaFuelEconomy {
  trims: EpaTrim[];
  cityMin: number;
  cityMax: number;
  highwayMin: number;
  highwayMax: number;
  combinedMin: number;
  combinedMax: number;
  fuelTypes: string[];
}

export interface FullVehicleData {
  vinDecode: VinDecodeResult;
  recalls: RecallResult[];
  complaints: ComplaintResult[];
  safetyRatings: SafetyRatingResult[];
  investigations: InvestigationResult[];
  mfrComms: MfrCommResult[];
  epa: EpaFuelEconomy | null;
}

// ============================================================
// Helpers
// ============================================================

interface FetchOpts {
  /** Cache TTL for Next data cache. Default 3600. Ignored if noNextCache. */
  revalidate?: number;
  /**
   * Skip Next's fetch cache. Use for endpoints that can exceed Next's 2 MB
   * cache cap (byYmmt, vehicle details). DB cache covers the gap.
   */
  noNextCache?: boolean;
}

async function fetchJson<T>(url: string, opts: FetchOpts = {}): Promise<T> {
  const init: RequestInit = opts.noNextCache
    ? { cache: "no-store" }
    : { next: { revalidate: opts.revalidate ?? 3600 } };
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, init);
      if (!res.ok) throw new Error(`NHTSA ${res.status} for ${url}`);
      return (await res.json()) as T;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function xmlField(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].trim() : "";
}

// ============================================================
// 1. vPIC — VIN Decoding
// ============================================================

export async function decodeVin(vin: string): Promise<VinDecodeResult> {
  const url = `${VPIC_BASE}/DecodeVinValues/${encodeURIComponent(vin)}?format=json`;
  const data = await fetchJson<{ Results: Record<string, string>[] }>(url);
  const r = data.Results?.[0] || {};
  const allFields: Record<string, string> = {};
  for (const [k, v] of Object.entries(r)) {
    if (v && v.trim() !== "" && v !== "Not Applicable") allFields[k] = v;
  }
  return {
    vin: vin.toUpperCase(),
    make: r.Make || "",
    model: r.Model || "",
    modelYear: r.ModelYear || "",
    trim: r.Trim || "",
    bodyClass: r.BodyClass || "",
    vehicleType: r.VehicleType || "",
    driveType: r.DriveType || "",
    fuelTypePrimary: r.FuelTypePrimary || "",
    engineCylinders: r.EngineCylinders || "",
    engineDisplacementL: r.DisplacementL || "",
    engineHP: r.EngineHP || "",
    transmissionStyle: r.TransmissionStyle || "",
    doors: r.Doors || "",
    seats: r.Seats || "",
    series: r.Series || "",
    manufacturer: r.Manufacturer || "",
    plantCity: r.PlantCity || "",
    plantState: r.PlantState || "",
    plantCountry: r.PlantCountry || "",
    gvwr: r.GVWR || "",
    errorCode: r.ErrorCode || "",
    errorText: r.ErrorText || "",
    allFields,
  };
}

// ============================================================
// 2. Recalls
// ============================================================

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

// ============================================================
// 3. Complaints
// ============================================================

export async function getComplaints(
  make: string,
  model: string,
  modelYear: string,
): Promise<ComplaintResult[]> {
  const url = `${COMPLAINTS_BASE}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(
    model,
  )}&modelYear=${encodeURIComponent(modelYear)}`;
  try {
    const data = await fetchJson<{ results: ComplaintResult[] }>(url, {
      noNextCache: true,
    });
    return data.results ?? [];
  } catch {
    return [];
  }
}

// ============================================================
// 4. Safety Ratings (5-Star)
// ============================================================

export async function getSafetyRatings(
  make: string,
  model: string,
  modelYear: string,
): Promise<SafetyRatingResult[]> {
  const listUrl = `${RATINGS_BASE}/modelyear/${encodeURIComponent(
    modelYear,
  )}/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}?format=json`;
  try {
    const list = await fetchJson<{ Results: SafetyRatingResult[] }>(listUrl);
    const variants = list.Results ?? [];
    if (variants.length === 0) return [];
    const detailed = await Promise.all(
      variants.slice(0, 5).map(async (v) => {
        try {
          const url = `${RATINGS_BASE}/VehicleId/${v.VehicleId}?format=json`;
          const d = await fetchJson<{ Results: SafetyRatingResult[] }>(url);
          return d.Results?.[0] ?? null;
        } catch {
          return null;
        }
      }),
    );
    return detailed.filter((r): r is SafetyRatingResult => r !== null);
  } catch {
    return [];
  }
}

// ============================================================
// 5+6. Investigations + TSBs (single byYmmt + details fetch)
// ============================================================

interface RawInvestigation {
  nhtsaActionNumber?: string;
  subject?: string;
  summary?: string;
  dateOpened?: string;
  dateClosed?: string | null;
  type?: string;
}

interface RawMfrComm {
  manufacturerCommunicationNumber?: string;
  nhtsaIdNumber?: string;
  subject?: string;
  summary?: string;
  communicationDate?: string;
  components?: Array<{ name?: string }>;
}

async function getVehicleIdByYmm(
  make: string,
  model: string,
  modelYear: string,
): Promise<number | null> {
  const url = `${VEHICLES_BY_YMMT}?modelYear=${encodeURIComponent(
    modelYear,
  )}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;
  try {
    const data = await fetchJson<{ results: { vehicleId: number }[] }>(url, {
      noNextCache: true,
    });
    return data.results?.[0]?.vehicleId ?? null;
  } catch {
    return null;
  }
}

async function getSafetyIssuesByVehicleId(
  vehicleId: number,
): Promise<{ investigations: InvestigationResult[]; mfrComms: MfrCommResult[] }> {
  const url = `${VEHICLE_DETAILS}/${vehicleId}/details?data=investigations,manufacturercommunications&productDetail=minimal`;
  try {
    const data = await fetchJson<{
      results: {
        safetyIssues?: {
          investigations?: RawInvestigation[];
          manufacturerCommunications?: RawMfrComm[];
        };
      }[];
    }>(url, { noNextCache: true });
    const issues = data.results?.[0]?.safetyIssues ?? {};
    const investigations: InvestigationResult[] = (issues.investigations ?? []).map((i) => ({
      investigationNumber: i.nhtsaActionNumber ?? "",
      nhtsaId: i.nhtsaActionNumber ?? "",
      subject: i.subject ?? "",
      description: i.summary ?? "",
      openDate: i.dateOpened ?? "",
      latestActivityDate: i.dateClosed ?? i.dateOpened ?? "",
      status: i.dateClosed ? "Closed" : "Open",
      investigationType: i.type ?? "",
    }));
    const mfrComms: MfrCommResult[] = (issues.manufacturerCommunications ?? []).map((m) => ({
      mfrCommId: m.manufacturerCommunicationNumber ?? m.nhtsaIdNumber ?? "",
      date: m.communicationDate ?? "",
      subject: m.subject ?? "",
      component: (m.components ?? []).map((c) => c.name).filter(Boolean).join(", "),
      summary: m.summary ?? "",
    }));
    return { investigations, mfrComms };
  } catch {
    return { investigations: [], mfrComms: [] };
  }
}

export async function getSafetyIssues(
  make: string,
  model: string,
  modelYear: string,
): Promise<{ investigations: InvestigationResult[]; mfrComms: MfrCommResult[] }> {
  const vid = await getVehicleIdByYmm(make, model, modelYear);
  if (!vid) return { investigations: [], mfrComms: [] };
  return getSafetyIssuesByVehicleId(vid);
}

// ============================================================
// 7. EPA Fuel Economy (separate API)
// ============================================================

export async function getEpaFuelEconomy(
  make: string,
  model: string,
  year: string,
): Promise<EpaFuelEconomy | null> {
  try {
    const menuUrl = `${EPA_BASE}/menu/options?year=${encodeURIComponent(
      year,
    )}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;
    const menuXml = await fetchText(menuUrl);
    const items = menuXml.split(/<menuItem>/).slice(1);
    const trimIds = items
      .map((c) => xmlField(c, "value"))
      .filter(Boolean)
      .slice(0, 8);
    if (trimIds.length === 0) return null;
    const trims = (
      await Promise.all(
        trimIds.map(async (id) => {
          try {
            const xml = await fetchText(`${EPA_BASE}/${id}`);
            const city = parseInt(xmlField(xml, "city08") || "0", 10);
            const highway = parseInt(xmlField(xml, "highway08") || "0", 10);
            const combined = parseInt(xmlField(xml, "comb08") || "0", 10);
            if (!city && !highway && !combined) return null;
            return {
              id,
              description: `${xmlField(xml, "displ")}L ${xmlField(xml, "cylinders")} cyl ${xmlField(xml, "trany")}`.trim(),
              cityMpg: city,
              highwayMpg: highway,
              combinedMpg: combined,
              fuelType: xmlField(xml, "fuelType") || xmlField(xml, "fuelType1") || "",
              co2: parseInt(xmlField(xml, "co2TailpipeGpm") || xmlField(xml, "co2") || "0", 10),
              annualFuelCost: parseInt(xmlField(xml, "fuelCost08") || "0", 10),
              displacementL: xmlField(xml, "displ"),
              cylinders: xmlField(xml, "cylinders"),
              transmission: xmlField(xml, "trany"),
            } satisfies EpaTrim;
          } catch {
            return null;
          }
        }),
      )
    ).filter((t): t is EpaTrim => t !== null);
    if (trims.length === 0) return null;
    const cities = trims.map((t) => t.cityMpg).filter((n) => n > 0);
    const highways = trims.map((t) => t.highwayMpg).filter((n) => n > 0);
    const combineds = trims.map((t) => t.combinedMpg).filter((n) => n > 0);
    return {
      trims,
      cityMin: cities.length ? Math.min(...cities) : 0,
      cityMax: cities.length ? Math.max(...cities) : 0,
      highwayMin: highways.length ? Math.min(...highways) : 0,
      highwayMax: highways.length ? Math.max(...highways) : 0,
      combinedMin: combineds.length ? Math.min(...combineds) : 0,
      combinedMax: combineds.length ? Math.max(...combineds) : 0,
      fuelTypes: Array.from(new Set(trims.map((t) => t.fuelType).filter(Boolean))),
    };
  } catch {
    return null;
  }
}

// ============================================================
// Combined: Full vehicle data from VIN
// ============================================================

export async function getFullVehicleData(vin: string): Promise<FullVehicleData> {
  const vinDecode = await decodeVin(vin);
  if (!vinDecode.make || !vinDecode.model || !vinDecode.modelYear) {
    return {
      vinDecode,
      recalls: [],
      complaints: [],
      safetyRatings: [],
      investigations: [],
      mfrComms: [],
      epa: null,
    };
  }
  const { make, model, modelYear } = vinDecode;

  const [recalls, complaints, safetyRatings, safety, epa] = await Promise.all([
    getRecalls(make, model, modelYear),
    getComplaints(make, model, modelYear),
    getSafetyRatings(make, model, modelYear),
    getSafetyIssues(make, model, modelYear),
    getEpaFuelEconomy(make, model, modelYear),
  ]);

  return {
    vinDecode,
    recalls,
    complaints,
    safetyRatings,
    investigations: safety.investigations,
    mfrComms: safety.mfrComms,
    epa,
  };
}

// ============================================================
// Cache-aware loader for the result page
// ============================================================

export interface VinPageData {
  vinDecode: VinDecodeResult;
  recalls: RecallResult[];
  complaints: ComplaintResult[];
  safetyRatings: SafetyRatingResult[];
  investigations: InvestigationResult[];
  mfrComms: MfrCommResult[];
  epa: EpaFuelEconomy | null;
  fromCache: boolean;
}

import {
  getCachedVin,
  saveVinCache,
  getCachedVehicle,
  saveVehicleCache,
  initializeDatabase,
  getCachedModelYears,
  saveModelYearsCache,
} from "./db";

// ============================================================
// vPIC Makes & Models
// ============================================================

export interface ModelInfo {
  modelId: number;
  modelName: string;
  makeId: number;
  makeName: string;
}

export async function getModelsForMake(make: string): Promise<ModelInfo[]> {
  const url = `${VPIC_BASE}/GetModelsForMake/${encodeURIComponent(make)}?format=json`;
  try {
    const data = await fetchJson<{
      Results: { Model_ID: number; Model_Name: string; Make_ID: number; Make_Name: string }[];
    }>(url, { revalidate: 86400 });
    return (data.Results ?? []).map((m) => ({
      modelId: m.Model_ID,
      modelName: m.Model_Name,
      makeId: m.Make_ID,
      makeName: m.Make_Name,
    }));
  } catch {
    return [];
  }
}

export async function getModelsForMakeYear(
  make: string,
  year: string | number,
): Promise<ModelInfo[]> {
  const url = `${VPIC_BASE}/GetModelsForMakeYear/make/${encodeURIComponent(
    make,
  )}/modelyear/${encodeURIComponent(String(year))}?format=json`;
  try {
    const data = await fetchJson<{
      Results: { Model_ID: number; Model_Name: string; Make_ID: number; Make_Name: string }[];
    }>(url, { revalidate: 86400 });
    return (data.Results ?? []).map((m) => ({
      modelId: m.Model_ID,
      modelName: m.Model_Name,
      makeId: m.Make_ID,
      makeName: m.Make_Name,
    }));
  } catch {
    return [];
  }
}

const looseModelKey = (s: string) => s.toLowerCase().replace(/[\s.\-_]+/g, "");

/**
 * Find every year NHTSA's vPIC GetModelsForMakeYear endpoint lists this
 * model. DB-cached for 30 days because the underlying call sweeps ~50 years
 * × parallel batches and overwhelming NHTSA from a hot make page would hurt.
 *
 * Loose-key match: NHTSA stores 'D-Series' / 'ST.REGIS' / 'W-Series' but
 * slug→formatModelName produces 'D Series' / 'ST REGIS' / 'W Series'.
 * Stripping punctuation lets both representations resolve.
 */
export async function getValidYearsForModel(
  make: string,
  model: string,
): Promise<string[]> {
  const cached = await getCachedModelYears(make, model);
  if (cached) return cached;

  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let y = currentYear + 1; y >= 1981; y--) years.push(String(y));

  const target = looseModelKey(model);
  const valid: string[] = [];

  for (let i = 0; i < years.length; i += 10) {
    const batch = years.slice(i, i + 10);
    const results = await Promise.all(
      batch.map(async (year) => {
        const models = await getModelsForMakeYear(make, year);
        return models.some((m) => looseModelKey(m.modelName) === target) ? year : null;
      }),
    );
    valid.push(...results.filter((y): y is string => y !== null));
    // Bail once we have data and hit a fully-empty batch (model is out of production)
    if (valid.length > 0 && results.every((r) => r === null)) break;
  }

  valid.sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
  await saveModelYearsCache(make, model, valid);
  return valid;
}

// ============================================================
// Year-page data loader (parallel sibling of getVinPageData, no VIN)
// ============================================================

export interface YearPageData {
  recalls: RecallResult[];
  complaints: ComplaintResult[];
  safetyRatings: SafetyRatingResult[];
  investigations: InvestigationResult[];
  mfrComms: MfrCommResult[];
  epa: EpaFuelEconomy | null;
  fromCache: boolean;
}

export async function getYearPageData(
  make: string,
  model: string,
  year: string,
): Promise<YearPageData> {
  await initializeDatabase().catch(() => undefined);

  const cached = await getCachedVehicle(make, model, year);
  if (cached) {
    return {
      recalls: (cached.recalls_data as RecallResult[]) ?? [],
      complaints: (cached.complaints_data as ComplaintResult[]) ?? [],
      safetyRatings: (cached.safety_data as SafetyRatingResult[]) ?? [],
      investigations: (cached.investigations_data as InvestigationResult[]) ?? [],
      mfrComms: (cached.mfr_comms_data as MfrCommResult[]) ?? [],
      epa: (cached.epa_data as EpaFuelEconomy) ?? null,
      fromCache: true,
    };
  }

  const [recalls, complaints, safetyRatings, safety, epa] = await Promise.all([
    getRecalls(make, model, year),
    getComplaints(make, model, year),
    getSafetyRatings(make, model, year),
    getSafetyIssues(make, model, year),
    getEpaFuelEconomy(make, model, year),
  ]);

  await saveVehicleCache({
    make,
    model,
    year,
    recalls_count: recalls.length,
    complaints_count: complaints.length,
    safety_rating: safetyRatings[0]?.OverallRating ?? null,
    investigations_count: safety.investigations.length,
    mfr_comms_count: safety.mfrComms.length,
    recalls_data: recalls,
    complaints_data: complaints,
    safety_data: safetyRatings,
    investigations_data: safety.investigations,
    mfr_comms_data: safety.mfrComms,
    epa_data: epa,
  });

  return {
    recalls,
    complaints,
    safetyRatings,
    investigations: safety.investigations,
    mfrComms: safety.mfrComms,
    epa,
    fromCache: false,
  };
}

/**
 * Load everything the VIN result page needs. Tries the 7-day DB cache first,
 * falls through to live NHTSA + EPA. On a fresh fetch, writes both caches
 * (vin_cache for the decode, vehicle_cache for the per-Y/M/M aggregate).
 */
export async function getVinPageData(vin: string): Promise<VinPageData> {
  await initializeDatabase().catch(() => undefined);

  // 1. VIN decode — cached for 7 days. Always need this for the hero.
  let cachedDecode = (await getCachedVin(vin)) as VinDecodeResult | null;
  if (!cachedDecode) {
    cachedDecode = await decodeVin(vin);
    await saveVinCache(
      vin,
      cachedDecode,
      cachedDecode.make,
      cachedDecode.model,
      cachedDecode.modelYear,
    );
  }
  const vinDecode = cachedDecode;

  if (!vinDecode.make || !vinDecode.model || !vinDecode.modelYear) {
    return {
      vinDecode,
      recalls: [],
      complaints: [],
      safetyRatings: [],
      investigations: [],
      mfrComms: [],
      epa: null,
      fromCache: false,
    };
  }

  // 2. Per-Y/M/M aggregate — cached for 7 days as a single blob.
  const cached = await getCachedVehicle(
    vinDecode.make,
    vinDecode.model,
    vinDecode.modelYear,
  );
  if (cached) {
    return {
      vinDecode,
      recalls: (cached.recalls_data as RecallResult[]) ?? [],
      complaints: (cached.complaints_data as ComplaintResult[]) ?? [],
      safetyRatings: (cached.safety_data as SafetyRatingResult[]) ?? [],
      investigations: (cached.investigations_data as InvestigationResult[]) ?? [],
      mfrComms: (cached.mfr_comms_data as MfrCommResult[]) ?? [],
      epa: (cached.epa_data as EpaFuelEconomy) ?? null,
      fromCache: true,
    };
  }

  const [recalls, complaints, safetyRatings, safety, epa] = await Promise.all([
    getRecalls(vinDecode.make, vinDecode.model, vinDecode.modelYear),
    getComplaints(vinDecode.make, vinDecode.model, vinDecode.modelYear),
    getSafetyRatings(vinDecode.make, vinDecode.model, vinDecode.modelYear),
    getSafetyIssues(vinDecode.make, vinDecode.model, vinDecode.modelYear),
    getEpaFuelEconomy(vinDecode.make, vinDecode.model, vinDecode.modelYear),
  ]);

  // best-effort cache write
  await saveVehicleCache({
    make: vinDecode.make,
    model: vinDecode.model,
    year: vinDecode.modelYear,
    recalls_count: recalls.length,
    complaints_count: complaints.length,
    safety_rating: safetyRatings[0]?.OverallRating ?? null,
    investigations_count: safety.investigations.length,
    mfr_comms_count: safety.mfrComms.length,
    recalls_data: recalls,
    complaints_data: complaints,
    safety_data: safetyRatings,
    investigations_data: safety.investigations,
    mfr_comms_data: safety.mfrComms,
    epa_data: epa,
  });

  return {
    vinDecode,
    recalls,
    complaints,
    safetyRatings,
    investigations: safety.investigations,
    mfrComms: safety.mfrComms,
    epa,
    fromCache: false,
  };
}
