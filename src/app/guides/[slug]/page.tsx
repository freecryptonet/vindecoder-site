import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { findGuide, GUIDES } from "@/lib/guides";

const SITE = "https://vindecoder.site";

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
        <article className="mt-6 max-w-3xl">
          <header>
            <h1 className="text-h1-page text-slate-950">{g.title}</h1>
            <p className="mt-3 text-base text-muted">{g.intro}</p>
          </header>

          <div className="mt-8 space-y-8">
            {g.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-h2 text-slate-950">{s.heading}</h2>
                <p className="mt-2 text-base text-slate-950 leading-relaxed">
                  {s.body}
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
