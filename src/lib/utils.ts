/** Strict ISO 3779 17-character VIN check (excludes I, O, Q). */
const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

export function isValidVin(vin: string): boolean {
  return VIN_RE.test(vin.toUpperCase());
}

/** Tighten an arbitrary URL/user input into a 17-char VIN, or null. */
export function normalizeVin(raw: string): string | null {
  const v = raw.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
  return VIN_RE.test(v) ? v : null;
}

/** ISO 3779 model-year letter chart (positions 10) for visible-year hints. */
const VIN_YEAR_CHART: Record<string, number[]> = {
  A: [1980, 2010], B: [1981, 2011], C: [1982, 2012], D: [1983, 2013],
  E: [1984, 2014], F: [1985, 2015], G: [1986, 2016], H: [1987, 2017],
  J: [1988, 2018], K: [1989, 2019], L: [1990, 2020], M: [1991, 2021],
  N: [1992, 2022], P: [1993, 2023], R: [1994, 2024], S: [1995, 2025],
  T: [1996, 2026], V: [1997, 2027], W: [1998, 2028], X: [1999, 2029],
  Y: [2000, 2030],
  "1": [2001, 2031], "2": [2002, 2032], "3": [2003, 2033], "4": [2004, 2034],
  "5": [2005, 2035], "6": [2006, 2036], "7": [2007, 2037], "8": [2008, 2038],
  "9": [2009, 2039],
};

/** Reads the year letter at VIN pos 10. Returns the most-recent plausible year. */
export function vinYearGuess(vin: string): number | null {
  if (!isValidVin(vin)) return null;
  const ch = vin[9].toUpperCase();
  const pair = VIN_YEAR_CHART[ch];
  if (!pair) return null;
  // ISO encoding cycles every 30 years; pick the most-recent year ≤ now+1.
  const horizon = new Date().getFullYear() + 1;
  return pair[1] <= horizon ? pair[1] : pair[0];
}

/** Title-case a string while preserving common acronyms. */
const ACRONYMS = new Set(["GM", "GMC", "BMW", "RAM", "USA", "SUV", "EV"]);
export function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (ACRONYMS.has(w.toUpperCase()) ? w.toUpperCase() : w[0]?.toUpperCase() + w.slice(1)))
    .join(" ");
}
