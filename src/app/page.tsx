import Link from "next/link";
import { VinSearchForm } from "@/components/VinSearchForm";
import { BrandLogo } from "@/components/BrandLogo";
import { Card } from "@/components/Card";
import { RecallItem } from "@/components/RecallItem";
import { JsonLd } from "@/components/JsonLd";
import { TOP_US_MAKES } from "@/lib/makes";
import { getHomepageRecentRecalls } from "@/lib/nhtsa";
import { websiteJsonLd, organizationJsonLd } from "@/lib/seo";
import { formatNhtsaDate } from "@/lib/utils";

export const revalidate = 3600;

export default async function HomePage() {
  const recentRecalls = await getHomepageRecentRecalls(5);

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />

      <section className="border-b border-border bg-surface-alt">
        <div className="container-page py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-h1-page md:text-h1-hero text-balance text-slate-950">
              Free VIN Decoder · NHTSA Recalls · Vehicle History
            </h1>
            <p className="mt-4 text-base text-muted md:text-lg">
              Decode any 17-digit VIN. Get recalls, complaints, safety ratings,
              and TSBs from official NHTSA data.
            </p>
            <div className="mx-auto mt-8 max-w-2xl">
              <VinSearchForm size="large" />
            </div>
          </div>
        </div>
      </section>

      {recentRecalls.length > 0 ? (
        <section className="container-page py-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-h2 text-slate-950">Recent NHTSA recalls</h2>
            <Link
              href="/recalls"
              className="text-sm font-medium text-brand-blue hover:underline"
            >
              View all →
            </Link>
          </div>
          <p className="mt-1 text-sm text-muted">
            Latest open-recall campaigns for popular US-market vehicles.
            Updates hourly from{" "}
            <a
              href="https://www.nhtsa.gov/"
              className="underline hover:text-slate-950"
              rel="noopener"
            >
              NHTSA
            </a>
            .
          </p>
          <ul className="mt-6 overflow-hidden rounded-card border border-border bg-surface">
            {recentRecalls.map((r) => (
              <li key={r.NHTSACampaignNumber}>
                <RecallItem
                  recall={{
                    campaignId: r.NHTSACampaignNumber,
                    title: `${r.ModelYear} ${r.Make} ${r.Model} — ${r.Component}`,
                    components: r.Component ? [r.Component] : undefined,
                    date: formatNhtsaDate(r.ReportReceivedDate),
                    href: `/recalls/${r.NHTSACampaignNumber}`,
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="container-page py-12">
        <h2 className="text-h2 text-slate-950">Browse by make</h2>
        <p className="mt-1 text-sm text-muted">
          Popular US-market manufacturers. Pick a make to see model-year
          reliability hubs.
        </p>
        <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {TOP_US_MAKES.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/makes/${m.slug}`}
                className="flex flex-col items-center gap-2 rounded-card border border-border bg-surface p-3 text-center text-sm font-medium text-slate-950 transition-shadow hover:shadow-md"
              >
                <BrandLogo make={m.name} size={48} />
                <span>{m.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-surface-alt">
        <div className="container-page py-12">
          <h2 className="text-h2 text-slate-950">What you get</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card>
              <h3 className="text-h3 text-slate-950">Open recalls</h3>
              <p className="mt-2 text-sm text-muted">
                Every NHTSA campaign with components, remedy, and contact
                information.
              </p>
            </Card>
            <Card>
              <h3 className="text-h3 text-slate-950">Owner complaints</h3>
              <p className="mt-2 text-sm text-muted">
                Component-clustered so you see the actual problem patterns,
                not noise.
              </p>
            </Card>
            <Card>
              <h3 className="text-h3 text-slate-950">Safety + specs</h3>
              <p className="mt-2 text-sm text-muted">
                NHTSA 5-Star rating, EPA fuel economy, chassis decode, and TSB
                links.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="text-h2 text-slate-950">How it works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { n: 1, t: "Enter VIN", d: "17 characters from the dashboard or door jamb." },
            { n: 2, t: "We decode it", d: "Live NHTSA lookup + chassis-grade pattern matching." },
            { n: 3, t: "See what NHTSA knows", d: "Recalls, complaints, ratings — all in one page." },
          ].map((s) => (
            <li key={s.n}>
              <Card>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-brand-red">{s.n}</span>
                  <h3 className="text-h3 text-slate-950">{s.t}</h3>
                </div>
                <p className="mt-2 text-sm text-muted">{s.d}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border bg-surface-alt">
        <div className="container-page py-10">
          <h2 className="text-h2 text-slate-950">More to explore</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            {[
              { href: "/recalls", label: "Recall index" },
              { href: "/wmi", label: "WMI directory" },
              { href: "/vin-year-chart", label: "VIN year chart" },
              { href: "/guides", label: "Buyer's guides" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-card border border-border bg-surface p-4 text-sm font-medium text-slate-950 transition-shadow hover:shadow-md"
                >
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
