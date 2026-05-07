import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getRecentRecallsFromCache } from "@/lib/db";
import { getHomepageRecentRecalls } from "@/lib/nhtsa";
import { formatNhtsaDate } from "@/lib/utils";

const SITE = "https://vindecoder.site";

// Refresh every hour — same cadence as the homepage strip.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Recent NHTSA Recalls — Vehicle Recall Campaign Lookup",
  description:
    "Latest open recall campaigns from the National Highway Traffic Safety Administration. Search by VIN, make, or campaign ID.",
  alternates: { canonical: "/recalls" },
};

export default async function RecallsIndexPage() {
  // Prefer cached aggregate (fast, broad). Fall back to live NHTSA sweep on
  // a cold cache so the page always has something to show.
  let entries = await getRecentRecallsFromCache(30);
  if (entries.length === 0) {
    const live = await getHomepageRecentRecalls(20);
    entries = live.map((r) => ({
      campaignNumber: r.NHTSACampaignNumber,
      make: r.Make,
      model: r.Model,
      modelYear: r.ModelYear,
      component: r.Component,
      date: r.ReportReceivedDate,
      summary: r.Summary,
    }));
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Recalls", url: `${SITE}/recalls` },
        ])}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Recalls" }]} />
        <header className="mt-6 max-w-3xl">
          <h1 className="text-h1-page text-slate-950">Recent NHTSA recalls</h1>
          <p className="mt-3 text-base text-muted">
            Latest open recall campaigns we&rsquo;ve cached from{" "}
            <a className="underline hover:text-slate-950" href="https://www.nhtsa.gov/" rel="noopener">
              NHTSA
            </a>
            . Each campaign affects a specific year/make/model and lists the
            component, the safety risk, and the dealer remedy.
          </p>
        </header>

        {entries.length === 0 ? (
          <Card className="mt-8 text-center text-sm text-muted">
            No cached recalls yet — try a VIN decode to seed the cache.
          </Card>
        ) : (
          <ul className="mt-8 overflow-hidden rounded-card border border-border bg-surface">
            {entries.map((e) => (
              <li key={e.campaignNumber}>
                <Link
                  href={`/recalls/${e.campaignNumber}`}
                  className="block border-b border-border p-4 transition-colors last:border-b-0 hover:bg-surface-alt"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="vin-mono text-xs font-semibold text-brand-red">
                      {e.campaignNumber}
                    </span>
                    <time className="text-xs text-muted">{formatNhtsaDate(e.date)}</time>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {e.modelYear} {e.make} {e.model} — {e.component || "Open recall"}
                  </p>
                  {e.summary ? (
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{e.summary}</p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
