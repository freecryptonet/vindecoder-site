import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Use VinDecoder at your own risk; the canonical source for vehicle safety data is NHTSA.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Terms of Service" }]} />
      <article className="mt-6 mx-auto max-w-3xl space-y-6 text-base text-slate-950 leading-relaxed">
        <h1 className="text-h1-page">Terms of Service</h1>
        <p className="text-sm text-muted">Last updated: 2026-05-07</p>

        <h2 className="text-h2">No warranty</h2>
        <p>
          VinDecoder pulls from public NHTSA, fueleconomy.gov, and ISO data
          sources and serves it as a courtesy. We make no warranty — express
          or implied — about the accuracy, completeness, currency, or fitness
          for any purpose of the data shown. If a recall or safety decision
          is on the line, the canonical source is{" "}
          <a className="underline" href="https://www.nhtsa.gov/" rel="noopener">nhtsa.gov</a>{" "}
          directly.
        </p>

        <h2 className="text-h2">Not legal, mechanical, or financial advice</h2>
        <p>
          The guides on this site are general-audience explainers. They are
          not legal advice, not a mechanical inspection, and not a financial
          recommendation. Don&rsquo;t buy or skip a car based solely on what
          you read here — get a qualified pre-purchase inspection.
        </p>

        <h2 className="text-h2">Acceptable use</h2>
        <p>
          You may use the site for personal, non-commercial VIN lookups and
          related research. You may not scrape the site at industrial scale
          or republish bulk data without permission — fetch from NHTSA
          directly for that. Automated bots that ignore robots.txt or
          overload the rate limits will be blocked.
        </p>

        <h2 className="text-h2">Liability</h2>
        <p>
          To the maximum extent permitted by law, VinDecoder and its operator
          are not liable for any damages, direct or consequential, arising
          from use of the site. If something on the site is wrong, please
          email us so we can fix it.
        </p>

        <h2 className="text-h2">Trademarks</h2>
        <p>
          Manufacturer names and model names belong to their respective
          owners. Their use on this site is nominative — we&rsquo;re identifying
          which vehicles each NHTSA campaign affects, not implying any
          endorsement or affiliation.
        </p>

        <h2 className="text-h2">Changes</h2>
        <p>
          These terms may change. Continued use after a change constitutes
          acceptance.
        </p>
      </article>
    </div>
  );
}
