/**
 * Country name → ISO 3166-1 alpha-2 code → flag emoji.
 *
 * Flag emoji are composed of two Regional Indicator Symbol code points,
 * one per ISO letter. Browsers/OSes that don't render flag emoji
 * (Windows native font notably) fall through to the letter pair, which
 * is still meaningful. That's the trade-off vs shipping ~50 KB of SVGs.
 */

const COUNTRY_TO_ISO: Record<string, string> = {
  "United States": "US",
  USA: "US",
  Canada: "CA",
  Mexico: "MX",
  Japan: "JP",
  Germany: "DE",
  "United Kingdom": "GB",
  France: "FR",
  Italy: "IT",
  Spain: "ES",
  Sweden: "SE",
  Norway: "NO",
  Finland: "FI",
  Denmark: "DK",
  Belgium: "BE",
  Netherlands: "NL",
  Austria: "AT",
  Switzerland: "CH",
  Poland: "PL",
  Czechia: "CZ",
  "Czech Republic": "CZ",
  Slovakia: "SK",
  Hungary: "HU",
  Portugal: "PT",
  Romania: "RO",
  Bulgaria: "BG",
  Greece: "GR",
  Ireland: "IE",
  "Korea (South)": "KR",
  "South Korea": "KR",
  China: "CN",
  India: "IN",
  Indonesia: "ID",
  Thailand: "TH",
  Malaysia: "MY",
  Philippines: "PH",
  Vietnam: "VN",
  Taiwan: "TW",
  Turkey: "TR",
  Iran: "IR",
  Pakistan: "PK",
  Myanmar: "MM",
  "Sri Lanka": "LK",
  Israel: "IL",
  "United Arab Emirates": "AE",
  Australia: "AU",
  "New Zealand": "NZ",
  Argentina: "AR",
  Brazil: "BR",
  "South Africa": "ZA",
  Kenya: "KE",
  Nigeria: "NG",
  Angola: "AO",
  Benin: "BJ",
  Madagascar: "MG",
  Tunisia: "TN",
  Malta: "MT",
};

/** ISO alpha-2 → flag emoji via regional indicator symbols. */
function isoToFlag(iso: string): string {
  if (iso.length !== 2) return "";
  const A = 0x1f1e6 - 0x41; // offset from ASCII 'A' to '🇦'
  return String.fromCodePoint(iso.charCodeAt(0) + A, iso.charCodeAt(1) + A);
}

/** Look up a country flag emoji from a name. Empty string if unknown. */
export function countryFlag(country: string | null | undefined): string {
  if (!country) return "";
  const iso = COUNTRY_TO_ISO[country.trim()];
  return iso ? isoToFlag(iso) : "";
}
