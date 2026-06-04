import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { MetricCard } from "@/components/MetricCard";
import { BrandLogo } from "@/components/BrandLogo";
import { RecallItem } from "@/components/RecallItem";
import { ComplaintItem } from "@/components/ComplaintItem";
import { SafetyStars } from "@/components/SafetyStars";
import { VinSearchForm } from "@/components/VinSearchForm";
import { JsonLd } from "@/components/JsonLd";
import { findMake } from "@/lib/makes";
import { getYearPageData } from "@/lib/nhtsa";
import { getModelYearAggregates } from "@/lib/db";
import { breadcrumbJsonLd, vehicleJsonLd } from "@/lib/seo";
import { COMPARISONS } from "@/lib/comparisons";
import {
  faqPageJsonLd,
  yearEditorialIntro,
  yearFaqs,
  type YearEditorialInput,
} from "@/lib/yearEditorial";
import { formatModelName, formatNhtsaDate, isValidModelYear, slugify } from "@/lib/utils";

const SITE = "https://vindecoder.site";

// 24h ISR — same TTL as DB cache reads, so a hit is essentially instant.
export const revalidate = 86400;

type Params = { make: string; model: string; year: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { make, model, year } = await params;
  const m = findMake(make);
  if (!m || !isValidModelYear(year)) {
    return { title: "Not found", robots: { index: false } };
  }
  const display = formatModelName(model);
  const data = await getYearPageData(m.name, display, year).catch(() => null);
  if (!data) {
    return {
      title: `${year} ${m.name} ${display}`,
      alternates: { canonical: `/makes/${m.slug}/${model}/${year}` },
    };
  }
  const star = data.safetyRatings[0]?.OverallRating;
  const bits: string[] = [
    `${data.recalls.length} Recall${data.recalls.length === 1 ? "" : "s"}`,
    `${data.complaints.length} Complaint${data.complaints.length === 1 ? "" : "s"}`,
  ];
  if (star && /^[1-5]$/.test(star)) bits.push(`${star}-Star Safety`);
  // Thin-content guard: if NHTSA returned no recalls, no complaints, no
  // safety rating, no investigations, no mfr comms, and no EPA data, the
  // page is essentially a navigation shell with no unique value. Tell
  // Google not to index it so the property isn't dragged down by empty
  // long-tail vehicles (e.g., obscure model years).
  const isEmpty =
    data.recalls.length === 0 &&
    data.complaints.length === 0 &&
    data.safetyRatings.length === 0 &&
    data.investigations.length === 0 &&
    data.mfrComms.length === 0 &&
    !data.epa;
  return {
    title: `${year} ${m.name} ${display} — ${bits.join(", ")}`,
    description: `${year} ${m.name} ${display}: ${data.recalls.length} NHTSA recalls, ${data.complaints.length} owner complaints${star && /^[1-5]$/.test(star) ? `, ${star}-star safety rating` : ""}. Free reliability report.`,
    alternates: { canonical: `/makes/${m.slug}/${model}/${year}` },
    robots: { index: !isEmpty, follow: true },
  };
}

export default async function YearReliabilityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { make: makeSlug, model: modelSlug, year } = await params;
  const m = findMake(makeSlug);
  if (!m) notFound();
  if (!isValidModelYear(year)) notFound();

  const display = formatModelName(modelSlug);
  const url = `${SITE}/makes/${m.slug}/${modelSlug}/${year}`;

  const [data, siblings] = await Promise.all([
    getYearPageData(m.name, display, year),
    getModelYearAggregates(m.name, display),
  ]);

  const { recalls, complaints, safetyRatings, investigations, mfrComms, epa } = data;
  const rawStar = safetyRatings[0]?.OverallRating;
  const star = rawStar && /^[1-5]$/.test(rawStar) ? rawStar : null;

  const editorialInput: YearEditorialInput = {
    year,
    make: m.name,
    model: display,
    recallsCount: recalls.length,
    complaintsCount: complaints.length,
    safetyRating: star,
    investigationsCount: investigations.length,
    mfrCommsCount: mfrComms.length,
    topComponents: deriveTopComponents(recalls, complaints),
  };
  const intro = yearEditorialIntro(editorialInput);
  const faqs = yearFaqs(editorialInput);

  // Contextual head-to-head: if this model appears in a curated comparison,
  // deep-link it. Loose match on make name + model display.
  const norm = (s: string) => s.toLowerCase().replace(/[\s.\-_]+/g, "");
  const relatedCompare = COMPARISONS.find(
    (c) =>
      (norm(c.a.make) === norm(m.name) && norm(c.a.model) === norm(display)) ||
      (norm(c.b.make) === norm(m.name) && norm(c.b.model) === norm(display)),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Makes", url: `${SITE}/makes` },
          { name: m.name, url: `${SITE}/makes/${m.slug}` },
          { name: display, url: `${SITE}/makes/${m.slug}/${modelSlug}` },
          { name: year, url },
        ])}
      />
      <JsonLd
        data={vehicleJsonLd({
          year,
          make: m.name,
          model: display,
          url,
        })}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />

      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/makes", label: "Makes" },
            { href: `/makes/${m.slug}`, label: m.name },
            { href: `/makes/${m.slug}/${modelSlug}`, label: display },
            { label: year },
          ]}
        />

        <header className="mt-6 flex flex-wrap items-start gap-4">
          <BrandLogo make={m.name} slug={m.slug} size={64} className="shrink-0" />
          <div className="flex-1 min-w-0">
            <h1 className="text-h1-page text-slate-950 md:text-4xl">
              {year} {m.name} {display}
            </h1>
            <p className="mt-3 max-w-3xl text-base text-slate-950">{intro}</p>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            count={recalls.length}
            label="Recalls"
            tone="red"
            summary={recalls.length > 0 ? "Open NHTSA campaigns" : "No active recalls"}
            href={recalls.length > 0 ? "#recalls" : undefined}
          />
          <MetricCard
            count={complaints.length}
            label="Complaints"
            tone="orange"
            summary={complaints.length > 0 ? `${complaints.length} owner reports` : "No NHTSA complaints"}
            href={complaints.length > 0 ? "#complaints" : undefined}
          />
          <MetricCard
            count={star ? `${star}★` : "—"}
            label="Safety"
            tone="blue"
            summary={star ? "NHTSA 5-Star rating" : "Not rated by NHTSA"}
            href={star ? "#safety" : undefined}
          />
          <MetricCard
            count={investigations.length}
            label="Investigations"
            tone="purple"
            summary={
              investigations.length > 0 ? "Active or closed defect probes" : "No defect investigations"
            }
            href={investigations.length > 0 ? "#investigations" : undefined}
          />
        </section>

        {recalls.length > 0 ? (
          <section id="recalls" className="mt-12">
            <h2 className="text-h2 text-slate-950">
              Recall campaigns ({recalls.length})
            </h2>
            <Card className="mt-3 border-2 border-brand-red/30 bg-brand-red/5">
              <p className="text-sm font-semibold text-slate-950">
                Recall repairs are <span className="text-brand-red">free</span>{" "}
                at any franchised {m.name} dealer.
              </p>
              <p className="mt-1 text-xs text-muted">
                Bring your VIN. Federal law (49 U.S.C. § 30120) requires the
                manufacturer to remedy any open safety recall at no cost.
              </p>
            </Card>
            <ul className="mt-4 overflow-hidden rounded-card border border-border bg-surface">
              {recalls.map((r) => {
                const firstSentence = (r.Summary || "").split(/\.\s/)[0] || "";
                const title =
                  firstSentence.slice(0, 110) ||
                  r.Component ||
                  r.NHTSACampaignNumber;
                return (
                  <li key={r.NHTSACampaignNumber}>
                    <RecallItem
                      recall={{
                        campaignId: r.NHTSACampaignNumber,
                        title,
                        components: r.Component ? [r.Component] : undefined,
                        date: formatNhtsaDate(r.ReportReceivedDate),
                        href: `/recalls/${r.NHTSACampaignNumber}`,
                      }}
                    />
                  </li>
                );
              })}
            </ul>
            {recalls.length > 15 ? (
              <p className="mt-3 text-sm text-muted">
                Showing 15 of {recalls.length} recalls.
              </p>
            ) : null}
          </section>
        ) : null}

        {complaints.length > 0 ? (
          <section id="complaints" className="mt-12">
            <h2 className="text-h2 text-slate-950">Recent complaints ({complaints.length})</h2>
            <p className="mt-1 text-sm text-muted">
              Most recent NHTSA owner complaints. Full clustering ships day-5.
            </p>
            <ul className="mt-4 overflow-hidden rounded-card border border-border bg-surface">
              {complaints.slice(0, 10).map((c) => (
                <li key={c.odiNumber}>
                  <ComplaintItem
                    complaint={{
                      odiNumber: String(c.odiNumber),
                      date: formatNhtsaDate(c.dateComplaintFiled || c.dateOfIncident),
                      summary: c.summary,
                      flags: {
                        crash: c.crash,
                        fire: c.fire,
                        injury: c.numberOfInjuries > 0,
                      },
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {safetyRatings.length > 0 ? (
          <section id="safety" className="mt-12">
            <h2 className="text-h2 text-slate-950">NHTSA safety ratings</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {safetyRatings.map((s) => (
                <Card key={s.VehicleId}>
                  <h3 className="text-h3 text-slate-950">{s.VehicleDescription}</h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-muted">
                      Overall
                    </span>
                    <SafetyStars rating={s.OverallRating} size="md" />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {epa && epa.combinedMin > 0 ? (
          <section className="mt-12">
            <h2 className="text-h2 text-slate-950">EPA fuel economy</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <MpgCard label="City" min={epa.cityMin} max={epa.cityMax} />
              <MpgCard label="Highway" min={epa.highwayMin} max={epa.highwayMax} />
              <MpgCard label="Combined" min={epa.combinedMin} max={epa.combinedMax} />
            </div>
          </section>
        ) : null}

        {investigations.length > 0 ? (
          <section id="investigations" className="mt-12">
            <h2 className="text-h2 text-slate-950">Defect investigations</h2>
            <ul className="mt-4 space-y-2">
              {investigations.slice(0, 5).map((i) => (
                <li
                  key={i.investigationNumber || i.subject}
                  className="rounded-card border border-border bg-surface p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="vin-mono text-xs font-semibold text-[#7C3AED]">
                      {i.investigationNumber || "—"}
                    </span>
                    <span className="text-xs text-muted">
                      {i.status}
                      {i.openDate ? ` · ${formatNhtsaDate(i.openDate)}` : ""}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-950">
                    {i.subject}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {siblings.length > 1 ? (
          <section className="mt-12">
            <h2 className="text-h2 text-slate-950">Other {m.name} {display} years</h2>
            <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {siblings.map((s) => (
                <li key={s.year}>
                  <Link
                    href={`/makes/${m.slug}/${slugify(display)}/${s.year}`}
                    className={`block rounded-card border bg-surface px-3 py-2 text-center text-sm font-semibold tabular-nums transition-colors ${
                      s.year === year
                        ? "border-slate-950 text-slate-950"
                        : "border-border text-slate-950 hover:border-slate-950"
                    }`}
                  >
                    {s.year}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-12">
          <h2 className="text-h2 text-slate-950">Frequently asked</h2>
          <dl className="mt-4 space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-card border border-border bg-surface p-5">
                <dt className="text-h3 text-slate-950">{f.question}</dt>
                <dd className="mt-2 text-sm text-muted">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-h2 text-slate-950">Related research &amp; guides</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {relatedCompare ? (
              <li>
                <Link
                  href={`/compare/${relatedCompare.slug}`}
                  className="text-sm text-slate-950 underline hover:text-brand-red"
                >
                  {relatedCompare.a.model} vs {relatedCompare.b.model}: compared head-to-head →
                </Link>
              </li>
            ) : null}
            <li>
              <Link href={`/makes/${m.slug}`} className="text-sm text-slate-950 underline hover:text-brand-red">
                All {m.name} reliability reports →
              </Link>
            </li>
            <li>
              <Link href="/recalls/most-recalled-cars" className="text-sm text-slate-950 underline hover:text-brand-red">
                Most recalled cars, ranked →
              </Link>
            </li>
            <li>
              <Link href="/guides/nhtsa-recall-lookup-explained" className="text-sm text-slate-950 underline hover:text-brand-red">
                How NHTSA recall lookups work →
              </Link>
            </li>
            <li>
              <Link href="/guides/buying-used-car-checklist" className="text-sm text-slate-950 underline hover:text-brand-red">
                Used-car buying checklist →
              </Link>
            </li>
            <li>
              <Link href="/guides/nhtsa-5-star-safety-ratings" className="text-sm text-slate-950 underline hover:text-brand-red">
                What NHTSA 5-star ratings mean →
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-16 border-t border-border pt-10 text-center">
          <h2 className="text-h2 text-slate-950">Check this year&rsquo;s VIN</h2>
          <div className="mx-auto mt-6 max-w-2xl">
            <VinSearchForm size="default" />
          </div>
        </section>
      </div>
    </>
  );
}

function MpgCard({ label, min, max }: { label: string; min: number; max: number }) {
  const display = min === max ? `${min}` : `${min}–${max}`;
  return (
    <Card className="text-center">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold text-brand-blue">
        {display}
        <span className="ml-1 text-sm font-medium text-muted">mpg</span>
      </p>
    </Card>
  );
}

function deriveTopComponents(
  recalls: { Component: string }[],
  complaints: { components: string }[],
): string[] {
  const counts = new Map<string, number>();
  for (const r of recalls) {
    if (!r.Component) continue;
    const key = r.Component.split(":")[0].trim();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  for (const c of complaints) {
    if (!c.components) continue;
    const key = c.components.split(":")[0].trim();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k.toLowerCase());
}
