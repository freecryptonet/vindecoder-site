import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { US_STATES } from "@/lib/states";

const SITE = "https://vindecoder.site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "License Plate Lookup by State — Free DMV Resources",
  description:
    "How to do a license plate lookup in every US state. Direct links to each state's DMV, what's free vs paid, and what's actually legal.",
  alternates: { canonical: "/license-plate" },
};

export default function LicensePlateIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "License Plate Lookup", url: `${SITE}/license-plate` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: US_STATES.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE}/license-plate/${s.slug}`,
            name: `${s.name} license plate lookup`,
          })),
        }}
      />
      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { label: "License Plate Lookup" },
          ]}
        />
        <header className="mt-6 max-w-3xl">
          <h1 className="text-h1-page text-slate-950">
            License plate lookup by state
          </h1>
          <p className="mt-3 text-base text-muted">
            US license plates aren&rsquo;t a public database the way VINs are.
            The federal{" "}
            <strong className="text-slate-950">
              Driver&rsquo;s Privacy Protection Act (18 U.S.C. § 2721)
            </strong>{" "}
            restricts who can request plate-holder information &mdash; mostly
            law enforcement, insurers, and licensed investigators. That&rsquo;s
            why no website (including this one) can legally return the
            owner&rsquo;s name from a plate.
          </p>
          <p className="mt-3 text-base text-muted">
            What you <em>can</em> do legally in each state: file an FOIA-style
            request for non-personal vehicle information, look up your own
            registration, or use your state&rsquo;s online services for
            functions like renewals and title transfers. Pick your state below
            for the specific links and process.
          </p>
          <p className="mt-3 text-sm text-muted">
            For the open VIN-based data (recalls, complaints, safety ratings),
            use our{" "}
            <Link href="/" className="underline hover:text-slate-950">
              VIN decoder
            </Link>{" "}
            instead &mdash; that&rsquo;s genuinely public.
          </p>
        </header>

        <h2 className="mt-10 text-h2 text-slate-950">All 50 states + DC</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {US_STATES.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/license-plate/${s.slug}`}
                className="block rounded-card border border-border bg-surface p-3 transition-colors hover:bg-surface-alt"
              >
                <div className="text-sm font-semibold text-slate-950">
                  {s.name}
                </div>
                <div className="text-xs text-muted">{s.abbr}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
