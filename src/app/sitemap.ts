import type { MetadataRoute } from "next";
import { TOP_US_MAKES } from "@/lib/makes";
import { getCachedVehicles } from "@/lib/db";
import { slugify } from "@/lib/utils";

export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = "https://vindecoder.site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/makes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  // 18 make hubs.
  for (const m of TOP_US_MAKES) {
    out.push({
      url: `${SITE}/makes/${m.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Year hubs that exist in the cache. Capped at 5000 to keep the sitemap
  // focused on URLs we know return real data — never 404s.
  const cached = await getCachedVehicles(5000).catch(() => []);
  const seen = new Set<string>();
  for (const v of cached) {
    const makeSlug = TOP_US_MAKES.find(
      (m) => m.name.toLowerCase() === v.make.toLowerCase(),
    )?.slug;
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
