import type { MetadataRoute } from "next";
import { TOP_US_MAKES } from "@/lib/makes";
import { GUIDES } from "@/lib/guides";
import { getCachedVehicles } from "@/lib/db";
import { slugify } from "@/lib/utils";

export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = "https://vindecoder.site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];

  const staticPages: { path: string; pri: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", pri: 1, freq: "daily" },
    { path: "/makes", pri: 0.9, freq: "weekly" },
    { path: "/recalls", pri: 0.8, freq: "daily" },
    { path: "/wmi", pri: 0.7, freq: "monthly" },
    { path: "/vin-year-chart", pri: 0.6, freq: "yearly" },
    { path: "/vehicle-types", pri: 0.6, freq: "monthly" },
    { path: "/guides", pri: 0.7, freq: "weekly" },
    { path: "/about", pri: 0.4, freq: "yearly" },
    { path: "/contact", pri: 0.4, freq: "yearly" },
    { path: "/privacy-policy", pri: 0.3, freq: "yearly" },
    { path: "/terms-of-service", pri: 0.3, freq: "yearly" },
  ];
  for (const p of staticPages) {
    out.push({ url: `${SITE}${p.path}`, lastModified: now, changeFrequency: p.freq, priority: p.pri });
  }

  // 5 launch guides.
  for (const g of GUIDES) {
    out.push({
      url: `${SITE}/guides/${g.slug}`,
      lastModified: new Date(g.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // 18 make hubs.
  for (const m of TOP_US_MAKES) {
    out.push({
      url: `${SITE}/makes/${m.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Year hubs that exist in the cache. Capped at 5000 — never list URLs
  // that would 404. Same for the WMI codes; we ship 859 detail pages but
  // only put the popular WMIs (matching our 18 makes) in the sitemap to
  // keep the file focused. The full registry stays discoverable from /wmi.
  const cached = await getCachedVehicles(5000).catch(() => []);
  const seen = new Set<string>();
  for (const v of cached) {
    const makeSlug = TOP_US_MAKES.find((m) => m.name.toLowerCase() === v.make.toLowerCase())?.slug;
    if (!makeSlug) continue;
    if (!/^\d{4}$/.test(v.year)) continue;
    const path = `/makes/${makeSlug}/${slugify(v.model)}/${v.year}`;
    if (seen.has(path)) continue;
    seen.add(path);
    out.push({
      url: `${SITE}${path}`,
      lastModified: v.lastFetched,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return out;
}
