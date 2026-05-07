import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE = "https://vindecoder.site";

const BLOCKED_AI_AGENTS = [
  "ClaudeBot",
  "anthropic-ai",
  "GPTBot",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "PerplexityBot",
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      ...BLOCKED_AI_AGENTS.map((ua) => ({
        userAgent: ua,
        disallow: "/",
      })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
