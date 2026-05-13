import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { VinSearchForm } from "@/components/VinSearchForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { UNIVERSAL_WMI_MAP } from "@/lib/universalWmi";
import { lookupWmiRegion } from "@/lib/wmiCountry";
import { countryFlag } from "@/lib/countryFlags";

const SITE = "https://vindecoder.site";

type Params = { code: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { code } = await params;
  const upper = code.toUpperCase();
  const manufacturer = UNIVERSAL_WMI_MAP[upper];
  if (!manufacturer) {
    return { title: "WMI not found", robots: { index: false } };
  }
  const { country } = lookupWmiRegion(upper);
  return {
    title: `WMI ${upper} — ${manufacturer}, ${country}`,
    description: `WMI ${upper} identifies vehicles built by ${manufacturer} in ${country}. ISO 3779 World Manufacturer Identifier reference.`,
    alternates: { canonical: `/wmi/${upper}` },
  };
}

export default async function WmiDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { code } = await params;
  const upper = code.toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]{3}$/.test(upper)) notFound();
  const manufacturer = UNIVERSAL_WMI_MAP[upper];
  if (!manufacturer) notFound();
  const { region, country } = lookupWmiRegion(upper);
  const url = `${SITE}/wmi/${upper}`;

  // "Other WMIs by this manufacturer" — group siblings by name.
  const siblings = Object.entries(UNIVERSAL_WMI_MAP)
    .filter(([c, m]) => m === manufacturer && c !== upper)
    .map(([c]) => c)
    .sort()
    .slice(0, 24);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "WMI Directory", url: `${SITE}/wmi` },
          { name: upper, url },
        ])}
      />
      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/wmi", label: "WMI Directory" },
            { label: upper },
          ]}
        />
        <header className="mt-6">
          <h1 className="text-h1-page text-slate-950">
            WMI <span className="vin-mono">{upper}</span> · {manufacturer}
          </h1>
          <p className="mt-2 text-base text-muted">
            Built in{" "}
            <span aria-hidden className="mr-1">
              {countryFlag(country)}
            </span>
            {country} ({region}).
          </p>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-xs uppercase tracking-wider text-muted">Manufacturer</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{manufacturer}</p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-wider text-muted">Country</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{country}</p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-wider text-muted">Region</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{region}</p>
          </Card>
        </div>

        <Card className="mt-8">
          <h2 className="text-h3 text-slate-950">VIN structure</h2>
          <p className="mt-2 text-sm text-muted">
            Every 17-character VIN is divided into three sections. The WMI is
            the first three characters; the next six narrow down the model and
            body type (the &ldquo;Vehicle Descriptor Section&rdquo;); the final
            eight identify the specific unit.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 pr-4">Pos</th>
                  <th className="py-2 pr-4">Chars</th>
                  <th className="py-2">Meaning</th>
                </tr>
              </thead>
              <tbody className="font-medium text-slate-950">
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">1–3</td>
                  <td className="py-2 pr-4 vin-mono">{upper}</td>
                  <td className="py-2">WMI · {manufacturer}, {country}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">4–9</td>
                  <td className="py-2 pr-4 vin-mono text-muted">······</td>
                  <td className="py-2">Vehicle descriptor section (model, body, engine, restraint)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">10</td>
                  <td className="py-2 pr-4 vin-mono text-muted">·</td>
                  <td className="py-2">Model year (see <Link href="/vin-year-chart" className="underline">VIN year chart</Link>)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">11</td>
                  <td className="py-2 pr-4 vin-mono text-muted">·</td>
                  <td className="py-2">Plant code</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">12–17</td>
                  <td className="py-2 pr-4 vin-mono text-muted">······</td>
                  <td className="py-2">Production sequence number</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {siblings.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-h2 text-slate-950">Other {manufacturer} WMIs</h2>
            <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {siblings.map((s) => (
                <li key={s}>
                  <Link
                    href={`/wmi/${s}`}
                    className="block rounded-chip border border-border bg-surface px-3 py-2 text-center text-sm font-semibold text-brand-blue hover:border-slate-950"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-12 border-t border-border pt-10 text-center">
          <h2 className="text-h2 text-slate-950">Have the full VIN?</h2>
          <p className="mt-1 text-sm text-muted">Decode all 17 characters at once.</p>
          <div className="mx-auto mt-6 max-w-2xl">
            <VinSearchForm size="default" />
          </div>
        </section>
      </div>
    </>
  );
}
