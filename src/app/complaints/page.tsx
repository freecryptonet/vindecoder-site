import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getRecentComplaintsFromCache } from "@/lib/db";
import { ALL_US_MAKES } from "@/lib/makes";
import { formatNhtsaComponent, formatNhtsaDate, slugify, titleCase } from "@/lib/utils";

const SITE = "https://vindecoder.site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Recent NHTSA Vehicle Complaints — Owner Reports by Make, Model, Year",
  description:
    "Latest owner complaints filed with the National Highway Traffic Safety Administration. Filter by component, severity, and year — find out what's failing on your car.",
  alternates: { canonical: "/complaints" },
};

function yearHubPath(make: string, model: string, year: string): string | null {
  const makeSlug = ALL_US_MAKES.find(
    (m) => m.name.toLowerCase() === make.toLowerCase(),
  )?.slug;
  if (!makeSlug || !model || !/^\d{4}$/.test(year)) return null;
  return `/makes/${makeSlug}/${slugify(model)}/${year}`;
}

export default async function ComplaintsIndexPage() {
  const entries = await getRecentComplaintsFromCache(30);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Complaints", url: `${SITE}/complaints` },
        ])}
      />
      <div className="container-page py-8">
        <Breadcrumbs
          items={[{ href: "/", label: "Home" }, { label: "Complaints" }]}
        />
        <header className="mt-6 max-w-3xl">
          <h1 className="text-h1-page text-slate-950">
            Recent NHTSA owner complaints
          </h1>
          <p className="mt-3 text-base text-muted">
            Real-world failure reports filed by US vehicle owners with{" "}
            <a
              className="underline hover:text-slate-950"
              href="https://www.nhtsa.gov/"
              rel="noopener"
            >
              NHTSA
            </a>
            . Each row links to the year-and-model hub where you can see the
            full complaint history, open recalls, and safety ratings.
          </p>
        </header>

        {entries.length === 0 ? (
          <Card className="mt-8 text-center text-sm text-muted">
            No complaints cached yet — try a VIN decode or browse a make to
            seed the cache.
          </Card>
        ) : (
          <ul className="mt-8 overflow-hidden rounded-card border border-border bg-surface">
            {entries.map((c) => {
              const hub = yearHubPath(c.make, c.model, c.modelYear);
              const inner = (
                <>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="vin-mono text-xs font-semibold text-brand-orange">
                      ODI {c.odiNumber}
                    </span>
                    <time className="text-xs text-muted">
                      {formatNhtsaDate(c.dateOfIncident)}
                    </time>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {c.modelYear} {titleCase(c.make)} {titleCase(c.model)}
                    {c.components ? (
                      <span className="font-normal text-muted">
                        {" "}
                        — {formatNhtsaComponent(c.components)}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm text-muted">
                    {c.summary}
                  </p>
                  {c.crash || c.fire || c.injuries > 0 ? (
                    <div className="mt-2 flex gap-1.5">
                      {c.crash ? (
                        <span className="rounded-chip bg-brand-red/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-red">
                          Crash
                        </span>
                      ) : null}
                      {c.fire ? (
                        <span className="rounded-chip bg-brand-red/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-red">
                          Fire
                        </span>
                      ) : null}
                      {c.injuries > 0 ? (
                        <span className="rounded-chip bg-brand-orange/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-orange">
                          {c.injuries} injur{c.injuries === 1 ? "y" : "ies"}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </>
              );
              return (
                <li key={c.odiNumber}>
                  {hub ? (
                    <Link
                      href={hub}
                      className="block border-b border-border p-4 transition-colors last:border-b-0 hover:bg-surface-alt"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="block border-b border-border p-4 last:border-b-0">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
