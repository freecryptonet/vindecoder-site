export type Make = { slug: string; name: string };

/**
 * 18 popular US-market passenger makes for the homepage brand grid
 * (6×3 desktop / 3×6 mobile). Ordered roughly by US 2024 sales volume.
 * These get the prime real-estate above the fold.
 */
export const TOP_US_MAKES: Make[] = [
  { slug: "toyota", name: "Toyota" },
  { slug: "ford", name: "Ford" },
  { slug: "chevrolet", name: "Chevrolet" },
  { slug: "honda", name: "Honda" },
  { slug: "nissan", name: "Nissan" },
  { slug: "hyundai", name: "Hyundai" },
  { slug: "kia", name: "Kia" },
  { slug: "jeep", name: "Jeep" },
  { slug: "subaru", name: "Subaru" },
  { slug: "gmc", name: "GMC" },
  { slug: "ram", name: "Ram" },
  { slug: "mazda", name: "Mazda" },
  { slug: "volkswagen", name: "Volkswagen" },
  { slug: "bmw", name: "BMW" },
  { slug: "mercedes-benz", name: "Mercedes-Benz" },
  { slug: "lexus", name: "Lexus" },
  { slug: "tesla", name: "Tesla" },
  { slug: "dodge", name: "Dodge" },
];

/**
 * Long-tail US-market passenger makes — not on the homepage grid, but
 * routing + year hubs work for them. Added 2026-05-07 after launch-day
 * GA4 showed crawler 404s on Audi / Cadillac / Land Rover etc. that the
 * old site's broader index had previously surfaced.
 *
 * Commercial trucks (Mack, International, Autocar, Freightliner,
 * Peterbilt), buses (Gillig, MCI, Blue Bird, Thomas), and motorcycle-only
 * makes are intentionally NOT included — different audience, different
 * SEO play. NHTSA recall data still works for those via /vin-decoder/[vin].
 */
export const EXTENDED_US_MAKES: Make[] = [
  { slug: "acura", name: "Acura" },
  { slug: "audi", name: "Audi" },
  { slug: "buick", name: "Buick" },
  { slug: "cadillac", name: "Cadillac" },
  { slug: "chrysler", name: "Chrysler" },
  { slug: "genesis", name: "Genesis" },
  { slug: "infiniti", name: "Infiniti" },
  { slug: "land-rover", name: "Land Rover" },
  { slug: "lincoln", name: "Lincoln" },
  { slug: "mini", name: "MINI" },
  { slug: "mitsubishi", name: "Mitsubishi" },
  { slug: "porsche", name: "Porsche" },
  { slug: "volvo", name: "Volvo" },
];

/** Every routable make — top + extended. */
export const ALL_US_MAKES: Make[] = [...TOP_US_MAKES, ...EXTENDED_US_MAKES];

const MAKE_BY_SLUG: Map<string, Make> = new Map(
  ALL_US_MAKES.map((m) => [m.slug, m]),
);

/** Resolve a slug to a Make, or undefined. Single source of truth used by
 *  every /makes/* route. */
export function findMake(slug: string): Make | undefined {
  return MAKE_BY_SLUG.get(slug.toLowerCase());
}
