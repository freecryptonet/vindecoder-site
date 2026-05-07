import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { GUIDES } from "@/lib/guides";

const SITE = "https://vindecoder.site";

export const metadata: Metadata = {
  title: "Buyer's Guides — Used Car Checklists, VIN Reading, Recall Lookups",
  description:
    "Honest, no-affiliate buyer's guides: how to read a VIN, what salvage titles really mean, odometer fraud, used-car inspection checklist, and how NHTSA recalls work.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Guides", url: `${SITE}/guides` },
        ])}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Guides" }]} />
        <header className="mt-6 max-w-3xl">
          <h1 className="text-h1-page text-slate-950">Buyer&rsquo;s guides</h1>
          <p className="mt-3 text-base text-muted">
            Plain-English explainers for the most-asked questions when buying
            a used car or decoding a VIN. No affiliate link spam, no upsells.
          </p>
        </header>

        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="block transition-shadow hover:shadow-md"
              >
                <Card>
                  <h2 className="text-h3 text-slate-950">{g.title}</h2>
                  <p className="mt-2 text-sm text-muted">{g.description}</p>
                  <p className="mt-3 text-xs font-medium text-brand-blue">
                    Read guide →
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
