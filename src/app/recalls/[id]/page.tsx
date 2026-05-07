import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { VinSearchForm } from "@/components/VinSearchForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getRecallCampaign } from "@/lib/nhtsa";
import { TOP_US_MAKES } from "@/lib/makes";
import { slugify } from "@/lib/utils";

const SITE = "https://vindecoder.site";

// 7-day revalidate — campaign records rarely change once issued.
export const revalidate = 604800;

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const upper = id.toUpperCase();
  const c = await getRecallCampaign(upper).catch(() => null);
  if (!c) {
    return { title: `Recall ${upper} — Not Found | VinDecoder`, robots: { index: false } };
  }
  const ymm = `${c.modelYears.join(", ")} ${c.makes.join(", ")} ${c.models.join(", ")}`.trim();
  return {
    title: `${ymm} Recall ${upper} — ${c.component} | VinDecoder`,
    description: `${c.component}. ${c.summary.slice(0, 140)}`,
    alternates: { canonical: `/recalls/${upper}` },
  };
}

function formatDate(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function RecallDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const upper = id.toUpperCase();
  if (!/^\d{2}[A-Z]\d{3,9}$/.test(upper)) notFound();
  const c = await getRecallCampaign(upper);
  if (!c) notFound();

  const url = `${SITE}/recalls/${upper}`;
  const knownMakes = new Set(TOP_US_MAKES.map((m) => m.name.toLowerCase()));
  const yearLinks = c.modelYears.flatMap((y) =>
    c.makes.flatMap((mk) =>
      c.models.map((md) => ({
        year: y,
        make: mk,
        model: md,
        slug:
          knownMakes.has(mk.toLowerCase())
            ? `/makes/${slugify(mk)}/${slugify(md)}/${y}`
            : null,
      })),
    ),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Recalls", url: `${SITE}/recalls` },
          { name: upper, url },
        ])}
      />
      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/recalls", label: "Recalls" },
            { label: upper },
          ]}
        />
        <header className="mt-6">
          <p className="vin-mono text-sm font-semibold text-brand-red">{upper}</p>
          <h1 className="mt-1 text-h1-page text-slate-950">{c.component || "NHTSA Recall"}</h1>
          <p className="mt-2 text-sm text-muted">
            Issued {formatDate(c.reportReceivedDate)} by {c.manufacturer}
            {c.potentialUnitsAffected ? ` · ~${c.potentialUnitsAffected.toLocaleString()} affected units` : ""}
          </p>
        </header>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Card>
            <p className="text-xs uppercase tracking-wider text-muted">Affected makes</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{c.makes.join(", ")}</p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-wider text-muted">Models</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{c.models.join(", ")}</p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-wider text-muted">Model years</p>
            <p className="mt-1 text-sm font-semibold text-slate-950 tabular-nums">
              {c.modelYears.join(", ")}
            </p>
          </Card>
        </div>

        {c.parkIt || c.parkOutside ? (
          <Card className="mt-6 border-2 border-brand-red/40 bg-brand-red/5">
            <h2 className="text-h3 text-brand-red">
              {c.parkIt ? "Park-it warning" : "Park outside warning"}
            </h2>
            <p className="mt-1 text-sm text-slate-950">
              {c.parkIt
                ? "NHTSA recommends not driving these vehicles until the recall is repaired."
                : "NHTSA recommends parking outdoors and away from structures until repaired."}
            </p>
          </Card>
        ) : null}

        <Card className="mt-6">
          <h2 className="text-h3 text-slate-950">Summary</h2>
          <p className="mt-2 text-sm text-slate-950">{c.summary}</p>
        </Card>

        {c.consequence ? (
          <Card className="mt-4">
            <h2 className="text-h3 text-slate-950">Consequence</h2>
            <p className="mt-2 text-sm text-slate-950">{c.consequence}</p>
          </Card>
        ) : null}

        {c.remedy ? (
          <Card className="mt-4">
            <h2 className="text-h3 text-slate-950">Remedy</h2>
            <p className="mt-2 text-sm text-slate-950">{c.remedy}</p>
          </Card>
        ) : null}

        {c.notes ? (
          <Card className="mt-4">
            <h2 className="text-h3 text-slate-950">Notes</h2>
            <p className="mt-2 text-sm text-muted">{c.notes}</p>
          </Card>
        ) : null}

        {yearLinks.some((l) => l.slug) ? (
          <section className="mt-8">
            <h2 className="text-h2 text-slate-950">Affected vehicles</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {yearLinks
                .filter((l) => l.slug)
                .map((l, i) => (
                  <li key={`${l.slug}-${i}`}>
                    <Link
                      href={l.slug!}
                      className="block rounded-card border border-border bg-surface p-3 text-sm font-medium text-slate-950 transition-shadow hover:shadow-md"
                    >
                      {l.year} {l.make} {l.model}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-12 border-t border-border pt-10 text-center">
          <h2 className="text-h2 text-slate-950">Check a specific VIN</h2>
          <p className="mt-1 text-sm text-muted">See if your vehicle is in this campaign.</p>
          <div className="mx-auto mt-6 max-w-2xl">
            <VinSearchForm size="default" />
          </div>
        </section>
      </div>
    </>
  );
}
