import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What VinDecoder collects (very little) and what we do with it (mostly nothing).",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Privacy Policy" }]} />
      <article className="mt-6 mx-auto max-w-3xl space-y-6 text-base text-slate-950 leading-relaxed">
        <h1 className="text-h1-page">Privacy Policy</h1>
        <p className="text-sm text-muted">Last updated: 2026-05-07</p>

        <h2 className="text-h2">Short version</h2>
        <p>
          We don&rsquo;t require an account, we don&rsquo;t collect your email,
          and we don&rsquo;t sell or share any individual-level data. The site
          uses Google Analytics 4 for anonymized aggregate traffic measurement
          and stores VINs you decode in a server-side cache that&rsquo;s used to
          speed up subsequent page loads.
        </p>

        <h2 className="text-h2">What we cache</h2>
        <p>
          When you decode a VIN we cache the NHTSA decode result on our server
          for up to 7 days, keyed by the VIN itself. We do this so the next
          person who looks up the same VIN gets a fast response without
          hitting NHTSA again. The cached row contains: the VIN, the decoded
          year/make/model, and the NHTSA response payload. It does not
          contain any data linking the lookup back to you.
        </p>

        <h2 className="text-h2">Server logs</h2>
        <p>
          The web server records standard request logs: timestamp, request
          path, response status, and the requesting IP. These rotate on a
          short window and are used for anti-abuse (rate-limiting bots, in
          practice). We don&rsquo;t join them against any personally identifying
          data.
        </p>

        <h2 className="text-h2">Analytics</h2>
        <p>
          Google Analytics 4 (property G-E2EJ44QMGZ) runs on every page and
          collects anonymized session data: country, browser, screen size,
          referrer, page paths visited. IP anonymization is on by default in
          GA4. If you set your browser&rsquo;s &ldquo;Do Not Track&rdquo; header
          we honor it and skip the GA4 script.
        </p>

        <h2 className="text-h2">Cookies</h2>
        <p>
          We don&rsquo;t set first-party cookies. Google Analytics may set its
          own. There is no login, no session, no advertising cookie.
        </p>

        <h2 className="text-h2">Third-party data sources</h2>
        <p>
          The site fetches data live from NHTSA, fueleconomy.gov, and
          ISO-published WMI registries. Those services have their own privacy
          notices. Server-side fetches don&rsquo;t pass your IP through.
        </p>

        <h2 className="text-h2">Children</h2>
        <p>
          The site is general-audience and not directed at children under 13.
          We don&rsquo;t knowingly collect data from children.
        </p>

        <h2 className="text-h2">Changes</h2>
        <p>
          If we materially change this policy we&rsquo;ll bump the date at the
          top. There&rsquo;s no email list to push notifications to.
        </p>

        <h2 className="text-h2">Contact</h2>
        <p>
          Questions: <a className="underline" href="mailto:hello@vindecoder.site">hello@vindecoder.site</a>.
        </p>
      </article>
    </div>
  );
}
