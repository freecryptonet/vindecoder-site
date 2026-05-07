import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact VinDecoder",
  description: "Get in touch about a VIN decode error, a missing recall, or a partnership.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Contact" }]} />
      <article className="mt-6 max-w-3xl space-y-6 text-base text-slate-950 leading-relaxed">
        <h1 className="text-h1-page">Contact</h1>

        <p>
          VinDecoder is a one-person side project. The fastest way to reach
          me about a wrong decode, a missing recall, or anything else
          factually off about the site is by email:
        </p>

        <p className="vin-mono text-lg">
          <a href="mailto:hello@vindecoder.site" className="underline">
            hello@vindecoder.site
          </a>
        </p>

        <p>
          For VIN-specific issues please paste the full 17-character VIN in
          your email along with what the page is showing wrong; otherwise I
          can&rsquo;t reproduce the issue. NHTSA data updates flow through me
          via NHTSA&rsquo;s API on a rolling 7-day cache, so brand-new recall
          campaigns may take up to a week to surface here. After that, if
          something still looks off, write in.
        </p>

        <p>
          For business inquiries (partnerships, ad placement, white-label)
          same address, &ldquo;Business&rdquo; in the subject line. We don&rsquo;t do
          paid placements that masquerade as editorial or rankings, so save
          us both time if that&rsquo;s the pitch.
        </p>
      </article>
    </div>
  );
}
