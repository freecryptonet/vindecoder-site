import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { StateBadge } from "@/components/StateBadge";
import { breadcrumbJsonLd } from "@/lib/seo";
import { faqPageJsonLd } from "@/lib/yearEditorial";
import { US_STATES, findState, type UsState } from "@/lib/states";
import { findStateProfile, type StateProfile } from "@/lib/stateProfiles";

const SITE = "https://vindecoder.site";

type Params = { state: string };

export async function generateStaticParams(): Promise<Params[]> {
  return US_STATES.map((s) => ({ state: s.slug }));
}

function stateFaqs(
  s: UsState,
  profile: StateProfile | undefined,
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  faqs.push({
    question: `Can the public look up who owns a ${s.name} license plate?`,
    answer: `No — under the federal Driver's Privacy Protection Act (18 U.S.C. § 2721), the ${s.dmvName} only releases plate-holder personal information to permitted requesters such as law enforcement, courts, insurers investigating a claim, and licensed private investigators with a documented legal need. Members of the public cannot pull a name and address from a ${s.abbr} plate.`,
  });
  if (profile) {
    faqs.push({
      question: `What threshold does ${s.name} use to brand a vehicle title as salvage?`,
      answer: profile.titleBrandNote,
    });
    faqs.push({
      question: `Does ${s.name} require a VIN inspection when I bring in a vehicle from another state?`,
      answer: profile.vinInspectionRequired
        ? `Yes — ${s.name} typically requires a physical VIN verification by the ${s.dmvName} or a law-enforcement officer before issuing a ${s.abbr} title for a vehicle previously titled elsewhere. The inspection card is a prerequisite for almost every out-of-state retitling path.`
        : `${s.name} does not require a physical VIN inspection for most clean out-of-state title transfers; check the current titling form instructions before assuming, since branded titles and rebuilt vehicles still need an in-person inspection.`,
    });
    faqs.push({
      question: `Where do I report dealer fraud or undisclosed title brands in ${s.name}?`,
      answer: `File a complaint with the ${s.name} Attorney General's consumer-protection division at ${profile.agConsumerUrl}. The AG's office often resolves motor-vehicle disputes at no cost to the consumer before any private legal action is needed.`,
    });
  }
  faqs.push({
    question: `If I only have a ${s.name} plate, how can I get the VIN legally?`,
    answer: `Ask the registered owner directly — the VIN is printed on the dashboard (visible through the windshield), the driver's-side door jamb sticker, the title, and the insurance card. If you're a buyer, seller, or have a legitimate transactional reason, the owner can simply provide it. No public service can legally return a VIN from a ${s.abbr} plate to a member of the public.`,
  });
  return faqs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { state } = await params;
  const s = findState(state);
  if (!s) {
    return { title: "Unknown state", robots: { index: false } };
  }
  const profile = findStateProfile(s.slug);
  const description = profile
    ? `${s.name} (${profile.nickname}) plate-lookup rules: what the ${s.dmvName} releases, title-brand thresholds, VIN inspection requirements, and how to file motor-vehicle complaints with the state AG.`
    : `How license plate lookup works in ${s.name}: what's free at the ${s.dmvName}, what's restricted under the Driver's Privacy Protection Act, and your options for VIN-based vehicle history.`;
  return {
    title: `${s.name} License Plate Lookup — DMV Rules, Title Brands & VIN Inspection`,
    description,
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
  const profile = findStateProfile(s.slug);
  const faqs = stateFaqs(s, profile);

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
      <JsonLd data={faqPageJsonLd(faqs)} />

      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/license-plate", label: "License Plate Lookup" },
            { label: s.name },
          ]}
        />

        <article className="mt-6 mx-auto max-w-3xl">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <StateBadge abbr={s.abbr} name={s.name} size="lg" className="shrink-0" />
            <div className="flex-1">
              <h1 className="text-h1-page text-slate-950">
                {s.name} license plate lookup
              </h1>
              <p className="mt-3 text-base text-muted">
                {profile
                  ? `Plate-holder information in ${s.name}, ${profile.nickname}, is regulated by the federal Driver’s Privacy Protection Act and rules set by the ${s.dmvName} out of ${profile.capital}. Here’s what you can actually look up, where, and for what purpose.`
                  : `Plate-holder information in ${s.name} is regulated by the federal Driver’s Privacy Protection Act and the state’s own privacy rules. Here’s what you can actually look up, where, and for what purpose.`}
              </p>
            </div>
          </header>

          <div className="mt-8 space-y-6">
            <section>
              <h2 className="text-h2 text-slate-950">
                Who can request plate-holder data in {s.name}
              </h2>
              <p className="mt-2 text-base leading-relaxed">
                {`Under the federal DPPA (18 U.S.C. § 2721), ${s.name}’s ${s.dmvName} only releases personal information attached to a license plate to permitted requesters: law enforcement, courts, state agencies, insurance carriers investigating claims, licensed private investigators, and others with a documented legal need. A casual member of the public asking who owns a plate doesn’t qualify — and no online service can legally provide that data either.`}
              </p>
            </section>

            <section>
              <h2 className="text-h2 text-slate-950">
                What you <em>can</em> look up in {s.name}
              </h2>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-base leading-relaxed">
                <li>
                  <strong>Your own plate and registration.</strong>{" "}
                  {`${s.name}’s ${s.dmvName} lets registered owners view their own vehicle’s status, renewal due dates, and emissions/inspection history online.`}
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
                {`The official online portal for vehicle services in ${s.name}: `}
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

            {profile ? (
              <section>
                <h2 className="text-h2 text-slate-950">
                  {`${s.name} title-brand & VIN-inspection rules`}
                </h2>
                <p className="mt-2 text-base leading-relaxed">
                  {`${s.name}, ${profile.nickname}, administers vehicle titling out of ${profile.capital} (the state capital) with the bulk of registrations concentrated around ${profile.largestCity}. ${profile.titleBrandNote}`}
                </p>
                <p className="mt-2 text-base leading-relaxed">
                  {profile.vinInspectionRequired
                    ? `Bringing a vehicle into ${s.name} from another state typically requires a physical VIN verification by ${s.dmvName} or a law-enforcement officer before a ${s.abbr} title can be issued. Schedule this before you start any registration paperwork — the inspection card is a prerequisite for almost every retitling path.`
                    : `${s.name} does not require a physical VIN inspection for most clean out-of-state title transfers — the prior title and the ${s.dmvName} retitling form are usually sufficient. Check current ${s.abbr} titling instructions before assuming, though, as branded titles and rebuilt vehicles still need an in-person inspection.`}
                </p>
                <p className="mt-2 text-base leading-relaxed">
                  Owner complaints about dealer fraud, odometer rollback, or
                  undisclosed title brands in {s.name} are handled by the state
                  Attorney General&rsquo;s consumer-protection division:{" "}
                  <a
                    href={profile.agConsumerUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="underline hover:text-slate-950"
                  >
                    {profile.agConsumerUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                  . File a complaint there before paying for a private
                  attorney &mdash; the AG&rsquo;s office often resolves
                  motor-vehicle disputes at no cost to the consumer.
                </p>
              </section>
            ) : null}

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

          <section className="mt-10">
            <h2 className="text-h2 text-slate-950">
              {`${s.name} plate-lookup FAQ`}
            </h2>
            <dl className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
              {faqs.map((f) => (
                <div key={f.question} className="p-4">
                  <dt className="text-base font-semibold text-slate-950">
                    {f.question}
                  </dt>
                  <dd className="mt-2 text-base leading-relaxed text-muted">
                    {f.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

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

        <section className="mt-16 mx-auto max-w-3xl border-t border-border pt-10">
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
