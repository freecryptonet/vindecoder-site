import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getMostRecalledModels } from "@/lib/recallStats";
import { titleCase, formatNhtsaDate } from "@/lib/utils";

const SITE = "https://vindecoder.site";

// Weekly ISR — the aggregation fans out ~175 NHTSA recall queries, so it
// must never run per-request. Generated once, served static for a week.
export const revalidate = 604800;

const PATH = "/recalls/most-recalled-cars";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Most Recalled Cars (2021–2025 Models): NHTSA Recall Rankings",
    description:
      "Which recent models have the most NHTSA safety recalls? We ranked popular 2021–2025 US vehicles by distinct recall campaigns and units affected, straight from official NHTSA data.",
    alternates: { canonical: PATH },
    robots: { index: true, follow: true },
  };
}

function fmtInt(n: number): string {
  return n.toLocaleString("en-US");
}

export default async function MostRecalledPage() {
  const data = await getMostRecalledModels();
  const url = `${SITE}${PATH}`;
  const updated = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Recalls", url: `${SITE}/recalls` },
          { name: "Most Recalled Cars", url },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Most Recalled Cars (2021–2025 Models)",
          description:
            "Ranking of popular US-market 2021–2025 vehicle models by number of distinct NHTSA recall campaigns and total units affected.",
          url,
          creator: { "@type": "Organization", name: "VinDecoder" },
          isBasedOn: "https://www.nhtsa.gov/recalls",
          license: "https://www.nhtsa.gov/",
          measurementTechnique:
            "Aggregation of NHTSA Recalls API campaigns across model years 2021–2025, deduplicated by NHTSA campaign number.",
        }}
      />

      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/recalls", label: "Recalls" },
            { label: "Most Recalled Cars" },
          ]}
        />

        <header className="mt-6">
          <h1 className="text-h1-page text-balance text-slate-950 md:text-4xl">
            Most recalled cars: 2021–2025 models ranked
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-950">
            A safety recall isn&rsquo;t a verdict on a bad car — high-volume
            best-sellers tend to top these lists simply because more of them are
            on the road. But the pattern still matters when you&rsquo;re
            shopping. We took {data.modelsCovered + " "}
            of the most popular US models and counted every distinct{" "}
            <Link href="/recalls" className="underline hover:text-slate-950">
              NHTSA recall campaign
            </Link>{" "}
            affecting their {data.generatedYears} model years. Updated {updated}.
          </p>
        </header>

        <section className="mt-6 grid grid-cols-3 gap-3">
          <Card className="text-center">
            <p className="text-xs uppercase tracking-wider text-muted">
              Models ranked
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-950 tabular-nums">
              {data.modelsCovered}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-xs uppercase tracking-wider text-muted">
              Recall campaigns
            </p>
            <p className="mt-1 text-3xl font-bold text-brand-red tabular-nums">
              {fmtInt(data.totalCampaigns)}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-xs uppercase tracking-wider text-muted">
              Units affected
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-950 tabular-nums">
              {fmtInt(data.totalUnits)}
            </p>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-h2 text-slate-950">The ranking</h2>
          <p className="mt-1 text-sm text-muted">
            Ranked by number of distinct recall campaigns across {data.generatedYears}{" "}
            model years, then by total units affected. Tap a model for its full
            year-by-year report.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-border bg-surface">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Model</th>
                  <th className="px-4 py-3 text-right font-semibold">Recalls</th>
                  <th className="px-4 py-3 text-right font-semibold">Units affected</th>
                  <th className="px-4 py-3 font-semibold">Top component</th>
                  <th className="px-4 py-3 font-semibold">Latest</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r, i) => (
                  <tr
                    key={`${r.makeSlug}-${r.modelSlug}`}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 font-semibold tabular-nums text-muted">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/makes/${r.makeSlug}/${r.modelSlug}/${r.linkYear}`}
                        className="font-semibold text-slate-950 hover:text-brand-red"
                      >
                        {titleCase(r.make)} {r.model}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-brand-red">
                      {r.campaigns}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-950">
                      {r.unitsAffected > 0 ? fmtInt(r.unitsAffected) : "—"}
                    </td>
                    <td className="px-4 py-3 capitalize text-muted">
                      {r.topComponent || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted">
                      {r.latestDate ? formatNhtsaDate(r.latestDate) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-h2 text-slate-950">How we built this</h2>
          <div className="mt-3 space-y-3 text-sm text-muted">
            <p>
              <strong className="text-slate-950">Source.</strong> Every figure
              comes from the{" "}
              <a
                href="https://www.nhtsa.gov/recalls"
                rel="noopener noreferrer"
                target="_blank"
                className="underline hover:text-slate-950"
              >
                National Highway Traffic Safety Administration
              </a>{" "}
              Recalls API — the same federal database manufacturers report to.
              We hold no opinion; these are public-record facts.
            </p>
            <p>
              <strong className="text-slate-950">Method.</strong> For each model
              we queried recall campaigns for the {data.generatedYears} model
              years and removed duplicates by NHTSA campaign number, so a single
              campaign spanning several years is counted once. &ldquo;Units
              affected&rdquo; sums each campaign&rsquo;s estimated
              potentially-affected vehicles.
            </p>
            <p>
              <strong className="text-slate-950">Caveat.</strong> Recall counts
              correlate with sales volume — more cars on the road means more
              units swept into any campaign. Read this as a map of where recent
              recall activity is concentrated, not a reliability score. For one
              specific vehicle, decode its VIN for the exact open campaigns.
            </p>
          </div>
        </section>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-h2 text-slate-950">Keep digging</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            <li>
              <Link href="/recalls" className="text-sm text-slate-950 underline hover:text-brand-red">
                Browse the latest NHTSA recall campaigns →
              </Link>
            </li>
            <li>
              <Link href="/compare" className="text-sm text-slate-950 underline hover:text-brand-red">
                Compare two models head-to-head →
              </Link>
            </li>
            <li>
              <Link href="/guides/nhtsa-recall-lookup-explained" className="text-sm text-slate-950 underline hover:text-brand-red">
                How NHTSA recall lookups work →
              </Link>
            </li>
            <li>
              <Link href="/makes" className="text-sm text-slate-950 underline hover:text-brand-red">
                Browse reliability reports by make →
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
