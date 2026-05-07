import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { UNIVERSAL_WMI_MAP } from "@/lib/universalWmi";
import { lookupWmiRegion } from "@/lib/wmiCountry";

const SITE = "https://vindecoder.site";

export const metadata: Metadata = {
  title: "WMI Directory — World Manufacturer Identifier Lookup (859 codes)",
  description:
    "Look up any 3-character VIN prefix (WMI) and find the manufacturer, country, and region. ISO 3779 / ISO 3780 reference for North America, Europe, Asia, Oceania, and South America.",
  alternates: { canonical: "/wmi" },
};

export default function WmiIndexPage() {
  const allCodes = Object.keys(UNIVERSAL_WMI_MAP).sort();
  // Group by leading character so the index renders region by region.
  const groups = new Map<string, string[]>();
  for (const code of allCodes) {
    const head = code[0];
    if (!groups.has(head)) groups.set(head, []);
    groups.get(head)!.push(code);
  }
  const orderedHeads = Array.from(groups.keys()).sort();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "WMI Directory", url: `${SITE}/wmi` },
        ])}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "WMI Directory" }]} />
        <header className="mt-6 max-w-3xl">
          <h1 className="text-h1-page text-slate-950">
            WMI Directory · {allCodes.length} codes
          </h1>
          <p className="mt-3 text-base text-muted">
            The first three characters of a VIN are the World Manufacturer
            Identifier (WMI). Together they pin down the manufacturer, the
            country of assembly, and the region. Below: every WMI we know.
          </p>
        </header>

        <nav aria-label="Quick jump" className="mt-6 flex flex-wrap gap-2">
          {orderedHeads.map((h) => (
            <a
              key={h}
              href={`#wmi-${h}`}
              className="rounded-chip border border-border bg-surface px-3 py-1 text-sm font-semibold text-slate-950 hover:border-slate-950"
            >
              {h}
            </a>
          ))}
        </nav>

        {orderedHeads.map((head) => {
          const sample = head + "AA";
          const region = lookupWmiRegion(sample).region;
          const codes = groups.get(head)!;
          return (
            <section key={head} id={`wmi-${head}`} className="mt-10">
              <h2 className="text-h2 text-slate-950">
                {head} · {region} <span className="text-muted text-sm font-normal">({codes.length})</span>
              </h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {codes.map((code) => (
                  <li key={code} className="flex items-baseline gap-2 text-sm">
                    <Link
                      href={`/wmi/${code}`}
                      className="vin-mono font-semibold text-brand-blue hover:underline"
                    >
                      {code}
                    </Link>
                    <span className="text-muted truncate">{UNIVERSAL_WMI_MAP[code]}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
