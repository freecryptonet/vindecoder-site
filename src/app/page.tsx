import Link from "next/link";
import { VinSearchForm } from "@/components/VinSearchForm";
import { BrandLogo } from "@/components/BrandLogo";
import { Card } from "@/components/Card";
import { RecallItem } from "@/components/RecallItem";
import { JsonLd } from "@/components/JsonLd";
import { TOP_US_MAKES } from "@/lib/makes";
import { getHomepageRecentRecalls } from "@/lib/nhtsa";
import { websiteJsonLd, organizationJsonLd } from "@/lib/seo";
import { faqPageJsonLd } from "@/lib/yearEditorial";
import { formatNhtsaDate, formatNhtsaComponent, titleCase } from "@/lib/utils";

export const revalidate = 3600;

// Question-intent content NHTSA's bare decoder tool never answers. Targets
// long-tail question queries and the "nhtsa vin decoder" branded intent by
// honestly positioning the one-page aggregation advantage.
const HOMEPAGE_FAQS = [
  {
    question: "Is this VIN decoder free?",
    answer:
      "Yes. Every decode, recall lookup, complaint history, and safety rating is free with no signup, no paywall, and no account. The data comes from the U.S. government's official NHTSA databases, which are public.",
  },
  {
    question: "How is this different from the NHTSA VIN decoder?",
    answer:
      "It uses the same official NHTSA data, but NHTSA splits it across four separate tools — the vPIC decoder, the recalls lookup, the complaints database, and the safety-ratings site. We query all of them at once and show the decode, open recalls, owner complaints, and 5-Star ratings together on one page for a given VIN.",
  },
  {
    question: "What information does a VIN decode show?",
    answer:
      "Year, make, model, trim, body class, engine, drivetrain, fuel type, plant of manufacture, and GVWR from the NHTSA vPIC database — plus every open recall campaign, owner-complaint patterns clustered by component, and the NHTSA 5-Star crash-test rating for that vehicle.",
  },
  {
    question: "Where do I find my VIN?",
    answer:
      "The 17-character VIN is stamped on the driver's-side dashboard where it meets the windshield, on the driver's door jamb sticker, and printed on your title, registration, and insurance card.",
  },
  {
    question: "Can I look up recalls by VIN?",
    answer:
      "Yes. Decoding a VIN returns every open NHTSA recall campaign that affects that specific vehicle, including the affected component, the manufacturer's remedy, and the campaign number — the same authoritative recall data NHTSA publishes.",
  },
  {
    question: "What years and vehicles are supported?",
    answer:
      "Any U.S.-market vehicle with a standardized 17-character VIN, which covers model year 1981 and newer. Pre-1981 vehicles used manufacturer-specific formats that the NHTSA database does not decode.",
  },
];

export default async function HomePage() {
  const recentRecalls = await getHomepageRecentRecalls(5);

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={faqPageJsonLd(HOMEPAGE_FAQS)} />

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
                    title: `${r.ModelYear} ${titleCase(r.Make)} ${titleCase(r.Model)} — ${formatNhtsaComponent(r.Component)}`,
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

      <section className="container-page py-12">
        <h2 className="text-h2 text-slate-950">Frequently asked questions</h2>
        <dl className="mt-6 divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
          {HOMEPAGE_FAQS.map((f) => (
            <div key={f.question} className="p-5">
              <dt className="text-h3 text-slate-950">{f.question}</dt>
              <dd className="mt-2 text-sm text-muted">{f.answer}</dd>
            </div>
          ))}
        </dl>
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
