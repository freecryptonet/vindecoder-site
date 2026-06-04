import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { SafetyStars } from "@/components/SafetyStars";
import { VinSearchForm } from "@/components/VinSearchForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { COMPARISONS, findComparison, type CompareSide } from "@/lib/comparisons";
import { getYearPageData, type YearPageData } from "@/lib/nhtsa";
import { titleCase, slugify } from "@/lib/utils";

const SITE = "https://vindecoder.site";

// Weekly ISR; each side is a cached NHTSA aggregate.
export const revalidate = 604800;

type Params = { slug: string };

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

function sideLabel(s: CompareSide): string {
  return `${s.year} ${titleCase(s.make)} ${s.model}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = findComparison(slug);
  if (!c) return { title: "Comparison not found", robots: { index: false } };
  const a = `${titleCase(c.a.make)} ${c.a.model}`;
  const b = `${titleCase(c.b.make)} ${c.b.model}`;
  return {
    title: `${a} vs ${b}: Recalls, Safety & Complaints Compared`,
    description: `${a} vs ${b} — ${c.blurb} Side-by-side NHTSA recalls, owner complaints, safety ratings, and EPA fuel economy.`,
    alternates: { canonical: `/compare/${c.slug}` },
    robots: { index: true, follow: true },
  };
}

function starOf(d: YearPageData): string | null {
  const raw = d.safetyRatings[0]?.OverallRating;
  return raw && /^[1-5]$/.test(raw) ? raw : null;
}

export default async function ComparePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const c = findComparison(slug);
  if (!c) notFound();

  const [da, db] = await Promise.all([
    getYearPageData(c.a.make, c.a.model, c.a.year),
    getYearPageData(c.b.make, c.b.model, c.b.year),
  ]);

  const url = `${SITE}/compare/${c.slug}`;
  const aName = sideLabel(c.a);
  const bName = sideLabel(c.b);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Compare", url: `${SITE}/compare` },
          { name: `${titleCase(c.a.make)} ${c.a.model} vs ${titleCase(c.b.make)} ${c.b.model}`, url },
        ])}
      />

      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/compare", label: "Compare" },
            { label: `${c.a.model} vs ${c.b.model}` },
          ]}
        />

        <header className="mt-6">
          <h1 className="text-h1-page text-balance text-slate-950 md:text-4xl">
            {titleCase(c.a.make)} {c.a.model} vs {titleCase(c.b.make)} {c.b.model}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-950">
            {c.blurb} Below is what official NHTSA data says about the {c.a.year}{" "}
            model year of each — recalls, owner complaints, crash-test ratings,
            and EPA fuel economy, side by side. Recalls and complaints are
            counts of public records; fewer is generally better.
          </p>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-3 md:gap-4">
          <SideColumn side={c.a} data={da} />
          <SideColumn side={c.b} data={db} />
        </section>

        <section className="mt-10">
          <h2 className="text-h2 text-slate-950">At a glance</h2>
          <div className="mt-4 overflow-x-auto rounded-card border border-border bg-surface">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-semibold">Metric</th>
                  <th className="px-4 py-3 text-right font-semibold">{c.a.model}</th>
                  <th className="px-4 py-3 text-right font-semibold">{c.b.model}</th>
                </tr>
              </thead>
              <tbody>
                <CompareRow
                  label="NHTSA recalls"
                  a={da.recalls.length}
                  b={db.recalls.length}
                  lowerBetter
                />
                <CompareRow
                  label="Owner complaints"
                  a={da.complaints.length}
                  b={db.complaints.length}
                  lowerBetter
                />
                <CompareRow
                  label="Defect investigations"
                  a={da.investigations.length}
                  b={db.investigations.length}
                  lowerBetter
                />
                <CompareRow
                  label="Overall safety (stars)"
                  a={starOf(da) ? Number(starOf(da)) : null}
                  b={starOf(db) ? Number(starOf(db)) : null}
                  lowerBetter={false}
                />
                <CompareRow
                  label="Combined MPG (max)"
                  a={da.epa?.combinedMax || null}
                  b={db.epa?.combinedMax || null}
                  lowerBetter={false}
                />
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            Highlighted cell = better on that metric. Safety and MPG: higher is
            better. Recalls, complaints, and investigations: lower is better.
            Data: NHTSA + EPA, {c.a.year} model year.
          </p>
        </section>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-h2 text-slate-950">Go deeper</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            <li>
              <Link
                href={`/makes/${slugify(c.a.make)}/${slugify(c.a.model)}/${c.a.year}`}
                className="text-sm text-slate-950 underline hover:text-brand-red"
              >
                Full {aName} report →
              </Link>
            </li>
            <li>
              <Link
                href={`/makes/${slugify(c.b.make)}/${slugify(c.b.model)}/${c.b.year}`}
                className="text-sm text-slate-950 underline hover:text-brand-red"
              >
                Full {bName} report →
              </Link>
            </li>
            <li>
              <Link href="/recalls/most-recalled-cars" className="text-sm text-slate-950 underline hover:text-brand-red">
                See the most-recalled models ranked →
              </Link>
            </li>
            <li>
              <Link href="/compare" className="text-sm text-slate-950 underline hover:text-brand-red">
                More head-to-head comparisons →
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-12 border-t border-border pt-10 text-center">
          <h2 className="text-h2 text-slate-950">Checking a specific car?</h2>
          <p className="mt-1 text-sm text-muted">
            Decode its VIN for the exact open recalls and specs.
          </p>
          <div className="mx-auto mt-6 max-w-2xl">
            <VinSearchForm size="default" />
          </div>
        </section>
      </div>
    </>
  );
}

function SideColumn({ side, data }: { side: CompareSide; data: YearPageData }) {
  const star = starOf(data);
  return (
    <Card>
      <h2 className="text-h3 text-slate-950">{sideLabel(side)}</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <Stat label="Recalls" value={String(data.recalls.length)} tone="red" />
        <Stat label="Complaints" value={String(data.complaints.length)} tone="orange" />
        <Stat label="Investigations" value={String(data.investigations.length)} />
        <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
          <dt className="text-xs uppercase tracking-wider text-muted">Safety</dt>
          <dd>
            {star ? (
              <SafetyStars rating={star} size="sm" />
            ) : (
              <span className="text-sm text-muted">Not rated</span>
            )}
          </dd>
        </div>
        {data.epa && data.epa.combinedMax > 0 ? (
          <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
            <dt className="text-xs uppercase tracking-wider text-muted">Combined MPG</dt>
            <dd className="text-sm font-semibold text-brand-blue tabular-nums">
              {data.epa.combinedMin === data.epa.combinedMax
                ? data.epa.combinedMax
                : `${data.epa.combinedMin}–${data.epa.combinedMax}`}
            </dd>
          </div>
        ) : null}
      </dl>
    </Card>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "red" | "orange";
}) {
  const color =
    tone === "red" ? "text-brand-red" : tone === "orange" ? "text-brand-orange" : "text-slate-950";
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className={`text-lg font-bold tabular-nums ${color}`}>{value}</dd>
    </div>
  );
}

function CompareRow({
  label,
  a,
  b,
  lowerBetter,
}: {
  label: string;
  a: number | null;
  b: number | null;
  lowerBetter: boolean;
}) {
  let aWins = false;
  let bWins = false;
  if (a != null && b != null && a !== b) {
    if (lowerBetter) {
      aWins = a < b;
      bWins = b < a;
    } else {
      aWins = a > b;
      bWins = b > a;
    }
  }
  const cell = (v: number | null, win: boolean) =>
    `px-4 py-3 text-right tabular-nums ${win ? "bg-brand-green/10 font-bold text-slate-950" : "text-slate-950"}`;
  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="px-4 py-3 text-muted">{label}</td>
      <td className={cell(a, aWins)}>{a == null ? "—" : a}</td>
      <td className={cell(b, bWins)}>{b == null ? "—" : b}</td>
    </tr>
  );
}
