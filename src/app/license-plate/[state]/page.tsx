import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { US_STATES, findState } from "@/lib/states";

const SITE = "https://vindecoder.site";

type Params = { state: string };

export async function generateStaticParams(): Promise<Params[]> {
  return US_STATES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { state } = await params;
  const s = findState(state);
  if (!s) {
    return { title: "Unknown state | VinDecoder", robots: { index: false } };
  }
  return {
    title: `${s.name} License Plate Lookup — DMV Resources & What's Legal`,
    description: `How license plate lookup works in ${s.name}: what's free at the ${s.dmvName}, what's restricted under the Driver's Privacy Protection Act, and your options for VIN-based vehicle history.`,
    alternates: { canonical: `/license-plate/${s.slug}` },
  };
}

export default async function StateLicensePlatePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { state } = await params;
  const s = findState(state);
  if (!s) notFound();

  const url = `${SITE}/license-plate/${s.slug}`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "License Plate Lookup", url: `${SITE}/license-plate` },
          { name: s.name, url },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${s.name} license plate lookup`,
          url,
          description: `How license plate lookup works in ${s.name}.`,
          isPartOf: { "@type": "WebSite", name: "VinDecoder", url: SITE },
        }}
      />

      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/license-plate", label: "License Plate Lookup" },
            { label: s.name },
          ]}
        />

        <article className="mt-6 max-w-3xl">
          <header>
            <h1 className="text-h1-page text-slate-950">
              {s.name} license plate lookup
            </h1>
            <p className="mt-3 text-base text-muted">
              Plate-holder information in {s.name} is regulated by the federal
              Driver&rsquo;s Privacy Protection Act and the state&rsquo;s own
              privacy rules. Here&rsquo;s what you can actually look up, where,
              and for what purpose.
            </p>
          </header>

          <div className="mt-8 space-y-6">
            <section>
              <h2 className="text-h2 text-slate-950">
                Who can request plate-holder data in {s.name}
              </h2>
              <p className="mt-2 text-base leading-relaxed">
                Under the federal DPPA (18 U.S.C. § 2721), {s.name}&rsquo;s{" "}
                {s.dmvName} only releases personal information attached to a
                license plate to permitted requesters: law enforcement, courts,
                state agencies, insurance carriers investigating claims,
                licensed private investigators, and others with a documented
                legal need. A casual member of the public asking who owns a
                plate doesn&rsquo;t qualify &mdash; and no online service can
                legally provide that data either.
              </p>
            </section>

            <section>
              <h2 className="text-h2 text-slate-950">
                What you <em>can</em> look up in {s.name}
              </h2>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-base leading-relaxed">
                <li>
                  <strong>Your own plate and registration.</strong>{" "}
                  {s.name}&rsquo;s {s.dmvName} lets registered owners view
                  their own vehicle&rsquo;s status, renewal due dates, and
                  emissions/inspection history online.
                </li>
                <li>
                  <strong>Public vehicle title status (non-personal).</strong>{" "}
                  Some title-brand information (salvage, rebuilt, flood) is
                  available without disclosing the owner. Run the VIN through{" "}
                  <a
                    className="underline hover:text-slate-950"
                    href="https://vehiclehistory.bja.ojp.gov/nmvtis_vehiclehistory"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    NMVTIS
                  </a>{" "}
                  &mdash; the federal title-history database that aggregates
                  all 50 states.
                </li>
                <li>
                  <strong>Recall and complaint history.</strong> If you can get
                  the VIN (from the dashboard, door jamb, or registration card)
                  you can pull every NHTSA recall and owner complaint filed
                  against that vehicle. That data is fully public.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-h2 text-slate-950">
                {`${s.dmvName} — contact & online portal`}
              </h2>
              <p className="mt-2 text-base leading-relaxed">
                The official online portal for vehicle services in {s.name}:{" "}
                <a
                  href={s.dmvUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="underline hover:text-slate-950"
                >
                  {s.dmvUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
                . Use this for registration renewals, title transfers, plate
                replacement, and lookup of your own records. For records
                requests on someone else&rsquo;s vehicle you&rsquo;ll need to
                submit a written request with a permitted-use justification
                under the DPPA.
              </p>
            </section>

            <section>
              <h2 className="text-h2 text-slate-950">
                If you only have a plate and need the VIN
              </h2>
              <p className="mt-2 text-base leading-relaxed">
                The most reliable path: ask the registered owner directly. The
                VIN is printed on the dashboard (visible through the
                windshield, driver&rsquo;s side), the driver&rsquo;s door jamb
                sticker, the title, and the insurance card. If you&rsquo;re a
                seller, a buyer, or have any legitimate transactional reason,
                the owner can simply give it to you.
              </p>
              <p className="mt-2 text-base leading-relaxed">
                If you have the VIN, run it through our free{" "}
                <Link href="/" className="underline hover:text-slate-950">
                  VIN decoder
                </Link>{" "}
                for the full NHTSA-backed vehicle history: open recalls, owner
                complaints, safety ratings, and EPA fuel economy.
              </p>
            </section>

            <section>
              <h2 className="text-h2 text-slate-950">
                Reverse plate lookup &ldquo;services&rdquo;: caveat emptor
              </h2>
              <p className="mt-2 text-base leading-relaxed">
                Search results for &ldquo;{s.name} license plate lookup&rdquo;
                surface a lot of paid services promising to return the
                owner&rsquo;s name and address. Most of them either (a)
                redirect you to a generic people-search aggregator and return
                whatever they have on file matching the plate state, often
                wrong; or (b) charge $20&ndash;$40 for an NMVTIS title report
                that you can get for $2&ndash;$5 from an{" "}
                <a
                  className="underline hover:text-slate-950"
                  href="https://vehiclehistory.bja.ojp.gov/nmvtis_approved_providers"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  NMVTIS-approved provider
                </a>
                . If a service claims to return the owner&rsquo;s name from a
                plate alone for a member of the public, walk away &mdash;
                that&rsquo;s either misleading or a DPPA violation.
              </p>
            </section>
          </div>

          <Card className="mt-10">
            <h3 className="text-h3 text-slate-950">
              Run a VIN check instead
            </h3>
            <p className="mt-2 text-sm text-muted">
              VIN-based lookups give you what plate lookups can&rsquo;t: open
              recalls, owner complaints, safety ratings, fuel economy &mdash;
              all from public federal sources.
            </p>
            <Link
              href="/"
              className="mt-3 inline-block rounded-card border border-border bg-surface-alt px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-surface"
            >
              Decode a VIN →
            </Link>
          </Card>
        </article>

        <section className="mt-16 max-w-3xl border-t border-border pt-10">
          <h2 className="text-h2 text-slate-950">Other states</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 md:grid-cols-4">
            {US_STATES.filter((x) => x.slug !== s.slug).map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/license-plate/${other.slug}`}
                  className="text-slate-950 hover:text-brand-red"
                >
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
