/**
 * Curated model-vs-model comparisons. These map high-intent "X vs Y" search
 * queries to a head-to-head reliability page that pulls real NHTSA data
 * (recalls, complaints, safety ratings, EPA) for both sides — genuine
 * information gain a single-VIN competitor can't match.
 *
 * Pairs are explicit (make/model/year per side) rather than parsed from the
 * slug, because make slugs ("mercedes-benz") and model slugs ("grand-cherokee",
 * "model-3") both contain hyphens and can't be split unambiguously.
 */

export interface CompareSide {
  make: string;
  model: string;
  year: string;
}

export interface Comparison {
  slug: string;
  a: CompareSide;
  b: CompareSide;
  /** One-line framing of the rivalry for intro + meta description. */
  blurb: string;
}

const YEAR = "2024";

export const COMPARISONS: Comparison[] = [
  {
    slug: "toyota-camry-vs-honda-accord",
    a: { make: "Toyota", model: "Camry", year: YEAR },
    b: { make: "Honda", model: "Accord", year: YEAR },
    blurb: "The two best-selling midsize sedans in America, head to head.",
  },
  {
    slug: "toyota-rav4-vs-honda-cr-v",
    a: { make: "Toyota", model: "RAV4", year: YEAR },
    b: { make: "Honda", model: "CR-V", year: YEAR },
    blurb: "The compact-SUV sales leaders compared on safety and recalls.",
  },
  {
    slug: "honda-civic-vs-toyota-corolla",
    a: { make: "Honda", model: "Civic", year: YEAR },
    b: { make: "Toyota", model: "Corolla", year: YEAR },
    blurb: "The compact-car benchmarks, compared on reliability data.",
  },
  {
    slug: "ford-f-150-vs-chevrolet-silverado-1500",
    a: { make: "Ford", model: "F-150", year: YEAR },
    b: { make: "Chevrolet", model: "Silverado 1500", year: YEAR },
    blurb: "America's two top-selling full-size pickups, side by side.",
  },
  {
    slug: "ford-f-150-vs-ram-1500",
    a: { make: "Ford", model: "F-150", year: YEAR },
    b: { make: "Ram", model: "1500", year: YEAR },
    blurb: "Full-size truck rivals compared on recalls and owner complaints.",
  },
  {
    slug: "tesla-model-3-vs-tesla-model-y",
    a: { make: "Tesla", model: "Model 3", year: YEAR },
    b: { make: "Tesla", model: "Model Y", year: YEAR },
    blurb: "Tesla's sedan vs. its crossover — recalls and safety compared.",
  },
  {
    slug: "jeep-wrangler-vs-ford-bronco",
    a: { make: "Jeep", model: "Wrangler", year: YEAR },
    b: { make: "Ford", model: "Bronco", year: YEAR },
    blurb: "The off-road icons, compared on NHTSA safety and recall data.",
  },
  {
    slug: "toyota-highlander-vs-honda-pilot",
    a: { make: "Toyota", model: "Highlander", year: YEAR },
    b: { make: "Honda", model: "Pilot", year: YEAR },
    blurb: "Three-row family SUVs compared on reliability and safety.",
  },
  {
    slug: "hyundai-tucson-vs-kia-sportage",
    a: { make: "Hyundai", model: "Tucson", year: YEAR },
    b: { make: "Kia", model: "Sportage", year: YEAR },
    blurb: "The corporate-cousin compact SUVs, head to head.",
  },
  {
    slug: "subaru-outback-vs-subaru-forester",
    a: { make: "Subaru", model: "Outback", year: YEAR },
    b: { make: "Subaru", model: "Forester", year: YEAR },
    blurb: "Subaru's two all-wheel-drive staples compared on the data.",
  },
  {
    slug: "chevrolet-tahoe-vs-ford-explorer",
    a: { make: "Chevrolet", model: "Tahoe", year: YEAR },
    b: { make: "Ford", model: "Explorer", year: YEAR },
    blurb: "Large family haulers compared on recalls, complaints, and safety.",
  },
  {
    slug: "nissan-rogue-vs-toyota-rav4",
    a: { make: "Nissan", model: "Rogue", year: YEAR },
    b: { make: "Toyota", model: "RAV4", year: YEAR },
    blurb: "Two of the highest-volume compact SUVs, compared on the numbers.",
  },
];

const BY_SLUG = new Map(COMPARISONS.map((c) => [c.slug, c]));

export function findComparison(slug: string): Comparison | undefined {
  return BY_SLUG.get(slug.toLowerCase());
}
