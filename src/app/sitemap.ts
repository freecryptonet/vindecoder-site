import type { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = "https://vindecoder.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Day-2 stub: only the homepage. Day-4 expands to make/model/year hubs once
  // those routes ship — never include URLs that would 404.
  return [
    {
      url: `${SITE}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
