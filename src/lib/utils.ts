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

/** URL-safe slug. "Mercedes-Benz" → "mercedes-benz", "F-150" → "f-150". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Reverse a slug into a display-friendly model name. Heuristic: ≤3-char
 * pure-alpha tokens become uppercase ("MKC", "RSX", "WRX"), digit-only
 * tokens stay as-is, mixed tokens capitalize each letter run ("4Runner",
 * "350Z"). Multi-token slugs get joined by spaces ("model-3" → "Model 3").
 */
export function formatModelName(slug: string): string {
  return slug
    .split("-")
    .map((tok) => {
      if (!tok) return tok;
      if (/^\d+$/.test(tok)) return tok;
      if (tok.length <= 3 && /^[a-z]+$/i.test(tok)) return tok.toUpperCase();
      return tok.replace(/[a-z]+/gi, (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
    })
    .join(" ");
}

/** True if year string is a plausible model year (1975 … now+2). */
export function isValidModelYear(year: string | number): boolean {
  const y = typeof year === "number" ? year : parseInt(year, 10);
  if (!Number.isFinite(y)) return false;
  return y >= 1975 && y <= new Date().getFullYear() + 2;
}

/**
 * Format a date string from NHTSA / EPA into US locale ("Apr 11, 2020").
 *
 * NHTSA returns dates inconsistently: some campaigns come back as MM/DD/YYYY
 * (US), others as DD/MM/YYYY (DD-first). `new Date()` rejects DD-first
 * strings as Invalid Date, so the raw string would leak into the UI.
 *
 * Strategy: pre-parse slash-separated dates ourselves, decide the format
 * from whether the first chunk is > 12 (must be a day), then build a
 * proper Date. Falls back to native Date parsing for ISO and other
 * recognized shapes; returns the raw string if everything fails.
 */
export function formatNhtsaDate(raw: string | null | undefined): string {
  if (!raw) return "";
  const m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const a = parseInt(m[1], 10);
    const b = parseInt(m[2], 10);
    const yr = parseInt(m[3], 10);
    let month: number;
    let day: number;
    if (a > 12) {
      // First chunk can't be a month → DD/MM/YYYY.
      day = a;
      month = b;
    } else if (b > 12) {
      // Second chunk can't be a day-of-month → MM/DD/YYYY.
      month = a;
      day = b;
    } else {
      // Ambiguous (both ≤ 12). NHTSA's US-API default is MM/DD.
      month = a;
      day = b;
    }
    const d = new Date(Date.UTC(yr, month - 1, day));
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
    }
  }
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
