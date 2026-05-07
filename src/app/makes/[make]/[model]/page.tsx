import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { VinSearchForm } from "@/components/VinSearchForm";
import { breadcrumbJsonLd } from "@/lib/seo";
import { TOP_US_MAKES } from "@/lib/makes";
import { getValidYearsForModel } from "@/lib/nhtsa";
import { getModelYearAggregates } from "@/lib/db";
import { formatModelName, slugify } from "@/lib/utils";

const SITE = "https://vindecoder.site";

export const revalidate = 86400;

type Params = { make: string; model: string };

function findMake(slug: string) {
  return TOP_US_MAKES.find((m) => m.slug === slug.toLowerCase());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { make, model } = await params;
  const m = findMake(make);
  if (!m) return { title: "Not found | VinDecoder", robots: { index: false } };
  const display = formatModelName(model);
  return {
    title: `${m.name} ${display} VIN Decoder — All Years, Recalls, Specs`,
    description: `Browse ${m.name} ${display} model years. NHTSA recalls, owner complaints, safety ratings, and TSBs for every available year.`,
    alternates: { canonical: `/makes/${m.slug}/${model.toLowerCase()}` },
  };
}

export default async function ModelPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { make: makeSlug, model: modelSlug } = await params;
  const m = findMake(makeSlug);
  if (!m) notFound();

  const display = formatModelName(modelSlug);
  const url = `${SITE}/makes/${m.slug}/${modelSlug}`;

  // getValidYearsForModel is cache-first (30d), but on a cold key it sweeps
  // ~50 years × parallel batches against NHTSA. We also pull what we have
  // in the local vehicle_cache so populated years jump out visually.
  const [years, aggregates] = await Promise.all([
    getValidYearsForModel(m.name, display),
    getModelYearAggregates(m.name, display),
  ]);

  if (years.length === 0 && aggregates.length === 0) {
    notFound();
  }

  const aggByYear = new Map(aggregates.map((a) => [a.year, a]));
  const allYears = Array.from(new Set([...years, ...aggregates.map((a) => a.year)]))
    .filter((y) => /^\d{4}$/.test(y))
    .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Makes", url: `${SITE}/makes` },
          { name: m.name, url: `${SITE}/makes/${m.slug}` },
          { name: display, url },
        ])}
      />

      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/makes", label: "Makes" },
            { href: `/makes/${m.slug}`, label: m.name },
            { label: display },
          ]}
        />

        <header className="mt-6">
          <h1 className="text-h1-page text-slate-950">
            {m.name} {display} VIN Decoder
          </h1>
          <p className="mt-2 text-base text-muted">
            {allYears.length} model year{allYears.length === 1 ? "" : "s"} on
            file. Pick a year for the full reliability hub.
          </p>
          <div className="mt-6 max-w-2xl">
            <VinSearchForm size="default" />
          </div>
        </header>

        <section className="mt-10">
          <h2 className="text-h2 text-slate-950">All model years</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {allYears.map((year) => {
              const agg = aggByYear.get(year);
              return (
                <li key={year}>
                  <Link
                    href={`/makes/${m.slug}/${slugify(display)}/${year}`}
                    className="block rounded-card border border-border bg-surface p-3 transition-shadow hover:shadow-md"
                  >
                    <p className="text-base font-semibold text-slate-950 tabular-nums">
                      {year}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {agg
                        ? `${agg.recalls} recall${agg.recalls === 1 ? "" : "s"} · ${agg.complaints} complaint${agg.complaints === 1 ? "" : "s"}`
                        : "NHTSA data on demand"}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <Card className="mt-12 text-sm text-muted">
          <h3 className="text-h3 text-slate-950">
            About the {m.name} {display}
          </h3>
          <p className="mt-2">
            We pull recall, complaint, safety-rating, and EPA data straight
            from NHTSA and fueleconomy.gov for every year of the {m.name}{" "}
            {display}. Pick a year above to see the full report.
          </p>
        </Card>
      </div>
    </>
  );
}
