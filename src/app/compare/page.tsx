import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { COMPARISONS } from "@/lib/comparisons";
import { titleCase } from "@/lib/utils";

const SITE = "https://vindecoder.site";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Compare Cars Head-to-Head: Recalls, Safety & Complaints",
  description:
    "Side-by-side reliability comparisons of popular US models using official NHTSA recall, complaint, and safety-rating data plus EPA fuel economy.",
  alternates: { canonical: "/compare" },
};

export default function CompareIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Compare", url: `${SITE}/compare` },
        ])}
      />
      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { label: "Compare" },
          ]}
        />
        <header className="mt-6">
          <h1 className="text-h1-page text-slate-950 md:text-4xl">
            Compare cars head-to-head
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-950">
            Shopping between two models? These head-to-head pages line up
            official NHTSA recalls, owner complaints, 5-star safety ratings, and
            EPA fuel economy side by side — so you can see which one the federal
            data favors.
          </p>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          {COMPARISONS.map((c) => (
            <Link key={c.slug} href={`/compare/${c.slug}`} className="block">
              <Card className="h-full transition-colors hover:border-slate-950">
                <h2 className="text-h3 text-slate-950">
                  {titleCase(c.a.make)} {c.a.model}{" "}
                  <span className="text-muted">vs</span> {titleCase(c.b.make)}{" "}
                  {c.b.model}
                </h2>
                <p className="mt-2 text-sm text-muted">{c.blurb}</p>
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
