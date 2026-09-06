import type { MetadataRoute } from "next";
import { ALL_US_MAKES } from "@/lib/makes";
import { GUIDES } from "@/lib/guides";
import { COMPARISONS } from "@/lib/comparisons";
import { US_STATES } from "@/lib/states";
import { getCachedVehicles } from "@/lib/db";
import { slugify } from "@/lib/utils";

export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = "https://vindecoder.site";

// Honest lastmod for evergreen curated pages. A sitemap that stamps every URL
// with `new Date()` on each daily rebuild trains Google to ignore lastmod
// entirely (the "crying wolf" problem) and erodes crawl trust — a real factor
// in why hubs/guides sat "Crawled - currently not indexed" for months. Bump
// this literal only when the curated content set is actually revised.
const CONTENT_REV = new Date("2026-09-06");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];

  // `now` only for pages whose content genuinely changes every day (live NHTSA
  // feeds). Everything evergreen uses CONTENT_REV so its lastmod stays stable.
  const staticPages: {
    path: string;
    pri: number;
    freq: MetadataRoute.Sitemap[number]["changeFrequency"];
    lastMod: Date;
  }[] = [
    { path: "/", pri: 1, freq: "daily", lastMod: now },
    { path: "/makes", pri: 0.9, freq: "weekly", lastMod: CONTENT_REV },
    { path: "/recalls", pri: 0.8, freq: "daily", lastMod: now },
    { path: "/recalls/most-recalled-cars", pri: 0.8, freq: "weekly", lastMod: CONTENT_REV },
    { path: "/compare", pri: 0.7, freq: "weekly", lastMod: CONTENT_REV },
    { path: "/complaints", pri: 0.8, freq: "daily", lastMod: now },
    { path: "/license-plate", pri: 0.7, freq: "monthly", lastMod: CONTENT_REV },
    { path: "/wmi", pri: 0.7, freq: "monthly", lastMod: CONTENT_REV },
    { path: "/vin-year-chart", pri: 0.6, freq: "yearly", lastMod: CONTENT_REV },
    { path: "/vehicle-types", pri: 0.6, freq: "monthly", lastMod: CONTENT_REV },
    { path: "/guides", pri: 0.7, freq: "weekly", lastMod: CONTENT_REV },
    { path: "/about", pri: 0.4, freq: "yearly", lastMod: CONTENT_REV },
    { path: "/contact", pri: 0.4, freq: "yearly", lastMod: CONTENT_REV },
    { path: "/privacy-policy", pri: 0.3, freq: "yearly", lastMod: CONTENT_REV },
    { path: "/terms-of-service", pri: 0.3, freq: "yearly", lastMod: CONTENT_REV },
  ];
  for (const p of staticPages) {
    out.push({ url: `${SITE}${p.path}`, lastModified: p.lastMod, changeFrequency: p.freq, priority: p.pri });
  }

  // Editorial guides — unique long-form content, real publish dates. These are
  // the strongest indexing candidates on the site, so they stay prioritised.
  for (const g of GUIDES) {
    out.push({
      url: `${SITE}/guides/${g.slug}`,
      lastModified: new Date(g.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Head-to-head comparison pages (curated rivalries).
  for (const c of COMPARISONS) {
    out.push({
      url: `${SITE}/compare/${c.slug}`,
      lastModified: CONTENT_REV,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Per-state license-plate landing pages (50 + DC).
  for (const st of US_STATES) {
    out.push({
      url: `${SITE}/license-plate/${st.slug}`,
      lastModified: CONTENT_REV,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Compute the freshest cache fetch per (make,model) so make hubs and model
  // hubs carry a real lastmod, then emit only the *hub* pages.
  //
  // Deliberately NOT listing the ~5000 individual year pages or the WMI-detail
  // bulk here. On a young, low-authority domain, submitting 6.7k mostly-thin
  // URLs spread Google's crawl budget so thin that even the make hubs and the
  // unique editorial guides went months without a re-crawl and stayed
  // "Crawled - currently not indexed". Concentrating the sitemap on hubs +
  // guides + curated assets lets crawl budget land where it earns indexing;
  // year and WMI pages remain fully indexable and are still discovered via
  // internal links from their parent hubs.
  const cached = await getCachedVehicles(5000).catch(() => []);
  const modelSeen = new Map<string, Date>();
  const makeSeen = new Map<string, Date>();
  for (const v of cached) {
    const makeSlug = ALL_US_MAKES.find((m) => m.name.toLowerCase() === v.make.toLowerCase())?.slug;
    if (!makeSlug) continue;
    if (!/^\d{4}$/.test(v.year)) continue;
    const prevMake = makeSeen.get(makeSlug);
    if (!prevMake || v.lastFetched > prevMake) makeSeen.set(makeSlug, v.lastFetched);
    const modelKey = `/makes/${makeSlug}/${slugify(v.model)}`;
    const prev = modelSeen.get(modelKey);
    if (!prev || v.lastFetched > prev) modelSeen.set(modelKey, v.lastFetched);
  }

  // Make hubs (top + extended passenger).
  for (const m of ALL_US_MAKES) {
    out.push({
      url: `${SITE}/makes/${m.slug}`,
      lastModified: makeSeen.get(m.slug) ?? CONTENT_REV,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Model hubs (/makes/[make]/[model]). One entry per (make,model) in cache;
  // the model page lists every year and links to each, so it is the indexable
  // parent that seeds discovery of the year pages.
  for (const [path, lastModified] of modelSeen) {
    out.push({
      url: `${SITE}${path}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.65,
    });
  }

  return out;
}
