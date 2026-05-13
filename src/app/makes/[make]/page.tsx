import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { BrandLogo } from "@/components/BrandLogo";
import { VinSearchForm } from "@/components/VinSearchForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { ALL_US_MAKES, findMake } from "@/lib/makes";
import { getModelsForMake } from "@/lib/nhtsa";
import { getTopVehicleYearsForMake } from "@/lib/db";
import { slugify, formatModelName, titleCase } from "@/lib/utils";

const SITE = "https://vindecoder.site";

// 24h ISR — vPIC's models list is stable; aggregates from DB are flush-only.
export const revalidate = 86400;

type Params = { make: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { make } = await params;
  const m = findMake(make);
  if (!m) return { title: "Make not found", robots: { index: false } };
  return {
    title: `${m.name} VIN Decoder — Free ${m.name} VIN Lookup, Recalls, Specs`,
    description: `Decode any ${m.name} VIN. Browse ${m.name} models and model-year reliability hubs powered by NHTSA recalls, complaints, and safety ratings.`,
    alternates: { canonical: `/makes/${m.slug}` },
  };
}

export async function generateStaticParams(): Promise<Params[]> {
  return ALL_US_MAKES.map((m) => ({ make: m.slug }));
}

export default async function MakePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { make: makeSlug } = await params;
  const m = findMake(makeSlug);
  if (!m) notFound();

  const [vpicModels, topYears] = await Promise.all([
    getModelsForMake(m.name),
    getTopVehicleYearsForMake(m.name, 12),
  ]);

  // Dedupe model names (vPIC sometimes returns duplicates) and sort A→Z.
  const modelNames = Array.from(
    new Set(vpicModels.map((v) => v.modelName.trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  const url = `${SITE}/makes/${m.slug}`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Makes", url: `${SITE}/makes` },
          { name: m.name, url },
        ])}
      />

      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/makes", label: "Makes" },
            { label: m.name },
          ]}
        />

        <header className="mt-6">
          <div className="flex items-center gap-4">
            <BrandLogo make={m.name} size={56} />
            <div>
              <h1 className="text-h1-page text-slate-950">
                {m.name} VIN Decoder
              </h1>
              <p className="text-sm text-muted">
                {modelNames.length} models · NHTSA recalls, complaints, safety ratings
              </p>
            </div>
          </div>
          <div className="mt-6 max-w-2xl">
            <VinSearchForm size="default" />
          </div>
        </header>

        {topYears.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-h2 text-slate-950">
              Most-reported {m.name} model years
            </h2>
            <p className="mt-1 text-sm text-muted">
              Cached year hubs ranked by NHTSA report volume.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {topYears.map((t) => (
                <li key={`${t.model}-${t.year}`}>
                  <Link
                    href={`/makes/${m.slug}/${slugify(t.model)}/${t.year}`}
                    className="block rounded-card border border-border bg-surface p-4 transition-shadow hover:shadow-md"
                  >
                    <p className="text-sm font-semibold text-slate-950">
                      {t.year} {m.name} {t.model}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {t.recalls} recall{t.recalls === 1 ? "" : "s"} ·{" "}
                      {t.complaints} complaint{t.complaints === 1 ? "" : "s"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {modelNames.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-h2 text-slate-950">All {m.name} models</h2>
            <p className="mt-1 text-sm text-muted">
              Tap a model to see year-by-year reliability and a list of every
              recall campaign on file.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {modelNames.map((name) => (
                <li key={name}>
                  <Link
                    href={`/makes/${m.slug}/${slugify(name)}`}
                    className="block rounded-card border border-border bg-surface px-3 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-surface-alt"
                  >
                    {formatModelName(slugify(name)) || titleCase(name)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <Card className="mt-12 text-center text-sm text-muted">
            NHTSA didn&rsquo;t return models for {m.name}. Try again in a few minutes.
          </Card>
        )}

        <section className="mt-12 rounded-card border border-border bg-surface-alt p-6 text-sm text-muted">
          <h3 className="text-h3 text-slate-950">About {m.name} VINs</h3>
          <p className="mt-2">
            Every {m.name} sold in the United States has a 17-character Vehicle
            Identification Number stamped on the dashboard, the driver-side
            door jamb, and the title. Decoding it through NHTSA&rsquo;s vPIC
            database surfaces the year, plant, engine, and trim — and unlocks
            the recall and complaint feeds we surface above.
          </p>
        </section>
      </div>
    </>
  );
}
