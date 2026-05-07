import Link from "next/link";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/BrandLogo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { ALL_US_MAKES, EXTENDED_US_MAKES, TOP_US_MAKES } from "@/lib/makes";

const SITE = "https://vindecoder.site";

export const metadata: Metadata = {
  title: `Browse by Make — VIN Decoder + Recall Lookup by Manufacturer (${ALL_US_MAKES.length} brands)`,
  description: `Pick a manufacturer to see model-year reliability hubs, recalls, and complaints. ${ALL_US_MAKES.length} US-market brands. Free, NHTSA-powered, no signup.`,
  alternates: { canonical: "/makes" },
};

export default function MakesIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Makes", url: `${SITE}/makes` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: ALL_US_MAKES.map((m, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE}/makes/${m.slug}`,
            name: m.name,
          })),
        }}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Makes" }]} />
        <header className="mt-6 max-w-3xl">
          <h1 className="text-h1-page text-slate-950">Browse by make</h1>
          <p className="mt-2 text-base text-muted">
            Pick a US-market manufacturer to see model-year reliability hubs:
            recalls, complaints, NHTSA safety ratings, and EPA fuel economy.
          </p>
        </header>

        <h2 className="mt-10 text-h2 text-slate-950">Most popular</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {TOP_US_MAKES.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/makes/${m.slug}`}
                className="flex flex-col items-center gap-2 rounded-card border border-border bg-surface p-4 text-center text-sm font-medium text-slate-950 transition-shadow hover:shadow-md"
              >
                <BrandLogo make={m.name} size={56} />
                <span>{m.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-h2 text-slate-950">More brands</h2>
        <p className="mt-1 text-sm text-muted">
          Long-tail US-market passenger makes — same recall, complaint, and
          safety data, less name recognition.
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {EXTENDED_US_MAKES.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/makes/${m.slug}`}
                className="flex flex-col items-center gap-2 rounded-card border border-border bg-surface p-4 text-center text-sm font-medium text-slate-950 transition-shadow hover:shadow-md"
              >
                <BrandLogo make={m.name} size={56} />
                <span>{m.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
