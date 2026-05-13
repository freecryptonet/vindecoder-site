/**
 * Per-make brand logos. Self-hosted PNGs in /public/logos/ sourced from
 * carlogos.org under fair-use editorial display. Each logo is 240x180,
 * total weight ~840 KB across 35 brands.
 *
 * BrandLogo renders the image when the slug is in MAKES_WITH_LOGO; falls
 * back to a brand-colored monogram for slugs not in the set.
 *
 * Adding a new make: download `https://www.carlogos.org/car-logos/<slug>-
 * logo.png` to `public/logos/<slug>.png` and add the slug to the set.
 */

export const MAKES_WITH_LOGO = new Set<string>([
  "toyota",
  "honda",
  "ford",
  "chevrolet",
  "nissan",
  "jeep",
  "bmw",
  "audi",
  "tesla",
  "hyundai",
  "kia",
  "lexus",
  "acura",
  "cadillac",
  "subaru",
  "mazda",
  "mitsubishi",
  "volkswagen",
  "volvo",
  "mini",
  "fiat",
  "porsche",
  "infiniti",
  "polestar",
  "chrysler",
  "ram",
  "mercedes-benz",
  "genesis",
  "rivian",
  "alfa-romeo",
  "dodge",
  "gmc",
  "buick",
  "lincoln",
  "land-rover",
]);

/** Brand-primary hex color for the monogram fallback (no '#' prefix). */
const FALLBACK_COLORS: Record<string, string> = {
  toyota: "EB0A1E",
  honda: "CC0000",
  ford: "003478",
  chevrolet: "D1AD57",
  nissan: "C3002F",
  jeep: "393B3A",
  bmw: "0066B1",
  audi: "BB0A30",
  tesla: "CC0000",
  hyundai: "002C5F",
  kia: "05141F",
  lexus: "1A1A1A",
  acura: "020202",
  cadillac: "941F40",
  subaru: "41ABE0",
  mazda: "1F4F87",
  mitsubishi: "E60012",
  volkswagen: "151F5D",
  volvo: "1B355E",
  mini: "000000",
  fiat: "B22222",
  porsche: "B12B28",
  infiniti: "002F73",
  polestar: "222222",
  chrysler: "1F375C",
  ram: "9E1B1B",
  "mercedes-benz": "1A1A1A",
  genesis: "A47148",
  rivian: "1A2533",
  "alfa-romeo": "9D0F23",
  dodge: "E60000",
  gmc: "CA0001",
  buick: "0B1F46",
  lincoln: "1F2D3D",
  "land-rover": "00563F",
};

/** Returns "/logos/<slug>.png" if a logo exists for this slug, else null. */
export function makeLogoPath(slug: string): string | null {
  return MAKES_WITH_LOGO.has(slug) ? `/logos/${slug}.png` : null;
}

/** Brand color for monogram fallback when no logo exists. */
export function makeFallbackColor(slug: string): string | undefined {
  return FALLBACK_COLORS[slug];
}
