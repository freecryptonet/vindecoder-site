/**
 * Lookup region + country from a WMI's first 1–2 characters.
 * Per ISO 3779 + ISO 3780 the first character marks region; the second
 * narrows to country.
 */

const REGION_FROM_FIRST: Record<string, { region: string; country: string }> = {
  // North America
  "1": { region: "North America", country: "United States" },
  "4": { region: "North America", country: "United States" },
  "5": { region: "North America", country: "United States" },
  "2": { region: "North America", country: "Canada" },
  "3": { region: "North America", country: "Mexico" },
  // Oceania
  "6": { region: "Oceania", country: "Australia" },
  "7": { region: "Oceania", country: "New Zealand" },
  // South America
  "8": { region: "South America", country: "Argentina" },
  "9": { region: "South America", country: "Brazil" },
};

const COUNTRY_FROM_FIRST_TWO: Record<string, string> = {
  // Africa (A–H)
  AA: "South Africa", AB: "South Africa", AC: "South Africa", AD: "South Africa", AE: "South Africa",
  AF: "South Africa", AG: "South Africa", AH: "South Africa",
  BA: "Angola", BB: "Angola", BC: "Angola", BD: "Angola", BE: "Angola",
  BF: "Kenya", BG: "Kenya", BH: "Kenya",
  BL: "Nigeria", BM: "Nigeria", BN: "Nigeria", BP: "Nigeria", BR: "Nigeria",
  CA: "Benin", CF: "Madagascar", CL: "Tunisia",
  // Asia (J–R)
  JA: "Japan", JB: "Japan", JC: "Japan", JD: "Japan", JE: "Japan", JF: "Japan",
  JG: "Japan", JH: "Japan", JJ: "Japan", JK: "Japan", JL: "Japan", JM: "Japan",
  JN: "Japan", JP: "Japan", JR: "Japan", JS: "Japan", JT: "Japan", JU: "Japan",
  JV: "Japan", JW: "Japan", JX: "Japan", JY: "Japan", JZ: "Japan", J0: "Japan",
  J1: "Japan", J2: "Japan", J3: "Japan", J4: "Japan", J5: "Japan", J6: "Japan",
  J7: "Japan", J8: "Japan", J9: "Japan",
  KA: "Sri Lanka", KB: "Sri Lanka", KC: "Sri Lanka", KD: "Sri Lanka", KE: "Sri Lanka",
  KF: "Israel", KG: "Israel", KH: "Israel", KJ: "Israel", KK: "Israel", KL: "Korea (South)",
  KM: "Korea (South)", KN: "Korea (South)", KP: "Korea (South)", KR: "Korea (South)", KS: "Korea (South)",
  KT: "Korea (South)", KU: "Korea (South)", KV: "Korea (South)", KW: "Korea (South)", KX: "Korea (South)",
  KY: "Korea (South)", KZ: "Korea (South)", K0: "Korea (South)", K1: "Korea (South)", K2: "Korea (South)",
  K3: "Korea (South)", K4: "Korea (South)", K5: "Korea (South)", K6: "Korea (South)", K7: "Korea (South)",
  K8: "Korea (South)", K9: "Korea (South)", KL2: "Korea (South)",
  LA: "China", LB: "China", LC: "China", LD: "China", LE: "China", LF: "China",
  LG: "China", LH: "China", LJ: "China", LK: "China", LL: "China", LM: "China",
  LN: "China", LP: "China", LR: "China", LS: "China", LT: "China", LU: "China",
  LV: "China", LW: "China", LX: "China", LY: "China", LZ: "China", L0: "China",
  L1: "China", L2: "China", L3: "China", L4: "China", L5: "China", L6: "China",
  L7: "China", L8: "China", L9: "China",
  MA: "India", MB: "India", MC: "India", MD: "India", ME: "India", MF: "Indonesia",
  MG: "Indonesia", MH: "Indonesia", MJ: "Indonesia", MK: "Indonesia", ML: "Thailand",
  MM: "Thailand", MN: "Thailand", MP: "Thailand", MR: "Thailand", MS: "Myanmar",
  NA: "Iran", NB: "Iran", NC: "Iran", ND: "Iran", NE: "Iran",
  NF: "Pakistan", NG: "Pakistan", NH: "Pakistan", NJ: "Pakistan",
  NL: "Turkey", NM: "Turkey", NN: "Turkey", NP: "Turkey", NR: "Turkey", NS: "Turkey", NT: "Turkey",
  NU: "Turkey", NV: "Turkey", NW: "Turkey", NX: "Turkey", NY: "Turkey", NZ: "Turkey",
  PA: "Philippines", PB: "Philippines", PC: "Philippines", PD: "Philippines", PE: "Philippines",
  PL: "Malaysia", PM: "Malaysia", PN: "Malaysia", PP: "Malaysia", PR: "Malaysia",
  RA: "United Arab Emirates", RF: "Taiwan", RG: "Taiwan", RH: "Taiwan", RJ: "Taiwan", RK: "Taiwan",
  RL: "Vietnam", RM: "Vietnam", RN: "Vietnam", RP: "Vietnam", RR: "Vietnam",
  // Europe (S–Z)
  SA: "United Kingdom", SB: "United Kingdom", SC: "United Kingdom", SD: "United Kingdom", SE: "United Kingdom",
  SF: "United Kingdom", SG: "United Kingdom", SH: "United Kingdom", SJ: "United Kingdom", SK: "United Kingdom",
  SL: "United Kingdom", SM: "United Kingdom", SN: "Germany",
  SP: "Germany", SR: "Germany", SS: "Germany", ST: "Germany", SU: "Poland", SV: "Poland",
  SW: "Poland", SX: "Poland", SY: "Poland", SZ: "Poland",
  TA: "Switzerland", TB: "Switzerland", TC: "Switzerland", TD: "Switzerland", TE: "Switzerland",
  TF: "Switzerland", TG: "Switzerland", TH: "Switzerland", TJ: "Czechia", TK: "Czechia", TL: "Czechia",
  TM: "Czechia", TN: "Czechia", TP: "Czechia", TR: "Hungary", TS: "Hungary", TT: "Hungary",
  TU: "Portugal", TV: "Portugal", TW: "Portugal",
  UA: "Slovakia", UB: "Slovakia", UC: "Slovakia", UD: "Slovakia", UE: "Slovakia", UF: "Slovakia", UG: "Slovakia",
  UH: "Denmark", UJ: "Ireland", UK: "Ireland", UL: "Romania", UM: "Romania", UN: "Romania",
  UU: "Romania", UV: "Romania", UW: "Romania", UX: "Romania", UY: "Romania", UZ: "Romania",
  VA: "Austria", VB: "Austria", VC: "Austria", VD: "Austria", VE: "Austria",
  VF: "France", VG: "France", VH: "France", VJ: "France", VK: "France", VL: "France",
  VM: "France", VN: "France", VP: "France", VR: "France",
  VS: "Spain", VT: "Spain", VU: "Spain", VV: "Spain", VW: "Spain", VX: "Spain",
  VY: "Spain", VZ: "Spain",
  WA: "Germany", WB: "Germany", WC: "Germany", WD: "Germany", WE: "Germany",
  WF: "Germany", WG: "Germany", WH: "Germany", WJ: "Germany", WK: "Germany",
  WL: "Germany", WM: "Germany", WN: "Germany", WP: "Germany",
  XA: "Bulgaria", XB: "Bulgaria", XC: "Bulgaria", XD: "Bulgaria", XE: "Bulgaria",
  XF: "Greece", XG: "Greece", XH: "Greece", XJ: "Greece", XK: "Greece",
  XL: "Netherlands", XM: "Netherlands", XN: "Netherlands", XP: "Netherlands", XR: "Netherlands",
  XS: "USSR (legacy)", XT: "USSR (legacy)", XU: "USSR (legacy)", XV: "USSR (legacy)", XW: "USSR (legacy)",
  YA: "Belgium", YB: "Belgium", YC: "Belgium", YD: "Belgium", YE: "Belgium",
  YF: "Finland", YG: "Finland", YH: "Finland", YJ: "Finland", YK: "Finland",
  YL: "Malta", YM: "Malta", YN: "Malta", YP: "Malta", YR: "Malta",
  YS: "Sweden", YT: "Sweden", YU: "Sweden", YV: "Sweden",
  YW: "Norway", YX: "Norway", YY: "Norway", YZ: "Norway",
  ZA: "Italy", ZB: "Italy", ZC: "Italy", ZD: "Italy", ZE: "Italy",
  ZF: "Italy", ZG: "Italy", ZH: "Italy", ZJ: "Italy", ZK: "Italy",
  ZL: "Italy", ZM: "Italy", ZN: "Italy", ZP: "Italy", ZR: "Italy",
  ZS: "Italy", ZT: "Italy", ZU: "Italy", ZV: "Italy", ZW: "Italy",
  ZX: "Italy", ZY: "Italy",
};

const REGION_FROM_LETTER: Record<string, string> = {
  A: "Africa", B: "Africa", C: "Africa", D: "Africa", E: "Africa",
  F: "Africa", G: "Africa", H: "Africa",
  J: "Asia", K: "Asia", L: "Asia", M: "Asia", N: "Asia", P: "Asia", R: "Asia",
  S: "Europe", T: "Europe", U: "Europe", V: "Europe", W: "Europe",
  X: "Europe", Y: "Europe", Z: "Europe",
};

export function lookupWmiRegion(code: string): { region: string; country: string } {
  const c = code.toUpperCase();
  // Numeric prefix: region is a single-char index.
  const numericMap = REGION_FROM_FIRST[c[0]];
  if (numericMap) return numericMap;
  // Letter prefix: combine first two for country precision.
  const country = COUNTRY_FROM_FIRST_TWO[c.slice(0, 2)];
  const region = REGION_FROM_LETTER[c[0]] ?? "Unknown";
  return { region, country: country ?? region };
}
