import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About VinDecoder",
  description:
    "VinDecoder is a free, ad-light, NHTSA-powered VIN decoder built for US drivers. No paywalls, no fake premium upsells.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />
      <article className="mt-6 max-w-3xl space-y-6 text-base text-slate-950 leading-relaxed">
        <h1 className="text-h1-page">About VinDecoder</h1>

        <p>
          VinDecoder is a free, NHTSA-powered VIN decoder built for US drivers
          buying, selling, or maintaining a vehicle. Drop in any 17-character
          VIN and we&rsquo;ll surface every recall campaign, owner complaint,
          NHTSA safety rating, EPA fuel-economy figure, and active defect
          investigation we can find — straight from the federal government&rsquo;s
          public datasets, with no paywall and no upsell to a paid &ldquo;premium&rdquo;
          report.
        </p>

        <h2 className="text-h2">Why we built it</h2>
        <p>
          Most VIN-decoder sites monetize by burying NHTSA&rsquo;s free data
          behind interstitials and trying to push you into a $39.99 vehicle
          history report. We don&rsquo;t. Recalls, complaints, safety ratings,
          and EPA mileage are taxpayer-funded; they should be one click and
          zero dollars away.
        </p>

        <p>
          For accident history, title brands, and odometer rollback detection
          we honestly don&rsquo;t have the data — those come from{" "}
          <a className="underline" href="https://www.carfax.com" rel="noopener nofollow">Carfax</a>
          , <a className="underline" href="https://www.autocheck.com" rel="noopener nofollow">AutoCheck</a>
          , and the federal{" "}
          <a className="underline" href="https://vehiclehistory.bja.ojp.gov/nmvtis_vehiclehistory" rel="noopener nofollow">
            NMVTIS
          </a>{" "}
          system. We may add affiliate links to those after we have measurable
          traffic, but never as a forced step in the decode flow.
        </p>

        <h2 className="text-h2">Where the data comes from</h2>
        <ul className="list-disc pl-6">
          <li>NHTSA vPIC — make/model/year decode and 130+ vehicle attributes</li>
          <li>NHTSA recallsByVehicle and campaignNumber — recall campaigns</li>
          <li>NHTSA complaintsByVehicle — owner complaints</li>
          <li>NHTSA SafetyRatings — 5-Star NCAP test results</li>
          <li>NHTSA byYmmt + details — open investigations and TSBs</li>
          <li>fueleconomy.gov — EPA fuel economy by trim</li>
          <li>ISO 3779 / 3780 — World Manufacturer Identifier registry</li>
        </ul>

        <h2 className="text-h2">What we don&rsquo;t collect</h2>
        <p>
          No accounts, no email, no IP logging beyond what the host serves up
          for traffic analytics. Read the full{" "}
          <Link className="underline" href="/privacy-policy">
            Privacy Policy
          </Link>{" "}
          for specifics.
        </p>
      </article>
    </div>
  );
}
