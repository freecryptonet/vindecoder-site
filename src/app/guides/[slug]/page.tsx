import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Fragment } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { findGuide, GUIDES } from "@/lib/guides";

const SITE = "https://vindecoder.site";

// Turn plain-text internal path references in guide bodies (e.g.
// "/guides/odometer-fraud-explained", "/vin-year-chart") into real <Link>s.
// Scoped to known top-level routes so we never accidentally match a year
// like "/1980" or a fragment that just looks like a path.
const INTERNAL_PATH_RE =
  /(\/(?:guides|recalls|complaints|makes|wmi|vin-decoder|license-plate|vehicle-types|vin-year-chart)(?:\/[a-z0-9-]+)*)/g;

function renderBody(body: string) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let i = 0;
  for (const match of body.matchAll(INTERNAL_PATH_RE)) {
    const start = match.index ?? 0;
    if (start > lastIndex) nodes.push(body.slice(lastIndex, start));
    nodes.push(
      <Link
        key={`l${i++}`}
        href={match[0]}
        className="font-medium text-brand-blue underline underline-offset-2 hover:text-slate-950"
      >
        {match[0]}
      </Link>,
    );
    lastIndex = start + match[0].length;
  }
  if (lastIndex < body.length) nodes.push(body.slice(lastIndex));
  return nodes.map((n, idx) => <Fragment key={idx}>{n}</Fragment>);
}

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) return { title: "Guide not found", robots: { index: false } };
  return {
    title: { absolute: `${g.title} — VinDecoder Guides` },
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) notFound();

  const url = `${SITE}/guides/${g.slug}`;
  const others = GUIDES.filter((x) => x.slug !== g.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Guides", url: `${SITE}/guides` },
          { name: g.title, url },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.description,
          datePublished: g.publishedAt,
          dateModified: g.publishedAt,
          author: { "@type": "Organization", name: "VinDecoder" },
          publisher: {
            "@type": "Organization",
            name: "VinDecoder",
            logo: { "@type": "ImageObject", url: `${SITE}/icon.png` },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
        }}
      />
      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/guides", label: "Guides" },
            { label: g.title },
          ]}
        />
        <article className="mt-6 mx-auto max-w-3xl">
          <header>
            <h1 className="text-h1-page text-slate-950">{g.title}</h1>
            <p className="mt-3 text-base text-muted">{g.intro}</p>
          </header>

          <div className="mt-8 space-y-8">
            {g.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-h2 text-slate-950">{s.heading}</h2>
                <p className="mt-2 text-base text-slate-950 leading-relaxed">
                  {renderBody(s.body)}
                </p>
              </section>
            ))}
          </div>
        </article>

        {others.length > 0 ? (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="text-h2 text-slate-950">More guides</h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/guides/${o.slug}`}
                    className="block transition-shadow hover:shadow-md"
                  >
                    <Card>
                      <h3 className="text-h3 text-slate-950">{o.title}</h3>
                      <p className="mt-2 text-sm text-muted">{o.description}</p>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
