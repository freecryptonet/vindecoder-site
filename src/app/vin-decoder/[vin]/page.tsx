import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { MetricCard } from "@/components/MetricCard";
import { RecallItem } from "@/components/RecallItem";
import { ComplaintItem } from "@/components/ComplaintItem";
import { SafetyStars } from "@/components/SafetyStars";
import { SpecsGrid } from "@/components/SpecsGrid";
import { VinDisplay } from "@/components/VinDisplay";
import { VinSearchForm } from "@/components/VinSearchForm";
import { JsonLd } from "@/components/JsonLd";
import { getVinPageData } from "@/lib/nhtsa";
import { isValidVin, titleCase, formatNhtsaDate } from "@/lib/utils";
import { breadcrumbJsonLd, vehicleJsonLd } from "@/lib/seo";

const SITE = "https://vindecoder.site";

// 7-day revalidate matches the DB cache TTL — page can be regenerated
// from cache or fall through to live NHTSA on miss.
export const revalidate = 604800;

type Params = { vin: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { vin } = await params;
  const upper = vin.toUpperCase();
  if (!isValidVin(upper)) {
    return { title: "VIN not recognized", robots: { index: false } };
  }
  const data = await getVinPageData(upper).catch(() => null);
  if (!data || !data.vinDecode.make) {
    return {
      title: `VIN ${upper}`,
      description: `Decode ${upper} with NHTSA. Recalls, complaints, safety ratings, and TSBs.`,
      alternates: { canonical: `/vin-decoder/${upper}` },
    };
  }
  const { vinDecode, recalls, complaints, safetyRatings } = data;
  const star = safetyRatings[0]?.OverallRating;
  const summary: string[] = [];
  summary.push(`${recalls.length} NHTSA recall${recalls.length === 1 ? "" : "s"}`);
  summary.push(`${complaints.length} complaint${complaints.length === 1 ? "" : "s"}`);
  if (star) summary.push(`${star}-star safety`);
  return {
    title: `${vinDecode.modelYear} ${titleCase(vinDecode.make)} ${vinDecode.model} — ${recalls.length} recalls · ${complaints.length} complaints`,
    description: `Decode VIN ${upper}: ${summary.join(", ")}. Free, instant, NHTSA-powered. No signup.`,
    alternates: { canonical: `/vin-decoder/${upper}` },
    robots: { index: true, follow: true },
  };
}

export default async function VinResultPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { vin: rawVin } = await params;
  const vin = rawVin.toUpperCase();
  if (!isValidVin(vin)) notFound();

  const data = await getVinPageData(vin);
  const { vinDecode, recalls, complaints, safetyRatings, investigations, mfrComms, epa } = data;

  // NHTSA returned a recognized make/model? If not, decode failed — show a
  // narrow "we couldn't decode" view so the user can correct typos.
  if (!vinDecode.make || !vinDecode.model || !vinDecode.modelYear) {
    return <DecodeFailed vin={vin} errorText={vinDecode.errorText} />;
  }

  const make = titleCase(vinDecode.make);
  const model = vinDecode.model;
  const year = vinDecode.modelYear;
  const trim = vinDecode.trim;
  const heroTitle = `${year} ${make} ${model}${trim ? ` ${trim}` : ""}`;
  const url = `${SITE}/vin-decoder/${vin}`;
  const rawStar = safetyRatings[0]?.OverallRating;
  // NHTSA returns "Not Rated" for un-tested vehicles — treat that as null so
  // the metric card doesn't render "Not Rated★".
  const star = rawStar && /^[1-5]$/.test(rawStar) ? rawStar : null;
  const recallCount = recalls.length;
  const complaintCount = complaints.length;
  const investigationCount = investigations.length;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "VIN Decoder", url: `${SITE}/` },
          { name: heroTitle, url },
        ])}
      />
      <JsonLd
        data={vehicleJsonLd({
          vin,
          year,
          make,
          model,
          trim,
          bodyClass: vinDecode.bodyClass,
          fuelType: vinDecode.fuelTypePrimary,
          driveType: vinDecode.driveType,
          url,
        })}
      />

      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/", label: "VIN Decoder" },
            { label: heroTitle },
          ]}
        />

        <header className="mt-6">
          <h1 className="text-h1-page text-balance text-slate-950 md:text-4xl">
            {heroTitle}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <VinDisplay vin={vin} />
            <span className="text-xs text-muted">
              Decoded from NHTSA{data.fromCache ? " · cached" : ""}
            </span>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            count={recallCount}
            label="Recalls"
            tone="red"
            summary={
              recallCount > 0
                ? `${recallCount === 1 ? "1 open campaign" : `${recallCount} open campaigns`}`
                : "No active recalls"
            }
            href={recallCount > 0 ? "#recalls" : undefined}
          />
          <MetricCard
            count={complaintCount}
            label="Complaints"
            tone="orange"
            summary={
              complaintCount > 0
                ? `${complaintCount} owner reports`
                : "No NHTSA complaints"
            }
            href={complaintCount > 0 ? "#complaints" : undefined}
          />
          <MetricCard
            count={star ? `${star}★` : "—"}
            label="Safety"
            tone="blue"
            summary={
              star
                ? "NHTSA 5-Star rating"
                : "Not rated by NHTSA"
            }
            href={star ? "#safety" : undefined}
          />
          <MetricCard
            count={investigationCount}
            label="Investigations"
            tone="purple"
            summary={
              investigationCount > 0
                ? `${investigationCount} active or closed`
                : "No defect investigations"
            }
            href={investigationCount > 0 ? "#investigations" : undefined}
          />
        </section>

        {recallCount > 0 ? (
          <section id="recalls" className="mt-12">
            <h2 className="text-h2 text-slate-950">Recalls ({recallCount})</h2>
            <p className="mt-1 text-sm text-muted">
              Open NHTSA recall campaigns affecting this vehicle.
            </p>
            <ul className="mt-4 overflow-hidden rounded-card border border-border bg-surface">
              {recalls.map((r) => {
                const firstSentence = (r.Summary || "").split(/\.\s/)[0] || "";
                const title =
                  firstSentence.slice(0, 110) ||
                  r.Component ||
                  r.NHTSACampaignNumber;
                return (
                  <li key={r.NHTSACampaignNumber}>
                    <RecallItem
                      recall={{
                        campaignId: r.NHTSACampaignNumber,
                        title,
                        components: r.Component ? [r.Component] : undefined,
                        date: formatNhtsaDate(r.ReportReceivedDate),
                        href: `/recalls/${r.NHTSACampaignNumber}`,
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {complaintCount > 0 ? (
          <section id="complaints" className="mt-12">
            <h2 className="text-h2 text-slate-950">Recent complaints ({complaintCount})</h2>
            <p className="mt-1 text-sm text-muted">
              Most recent NHTSA owner complaints. Day-3 surface — component
              clustering ships day-4.
            </p>
            <ul className="mt-4 overflow-hidden rounded-card border border-border bg-surface">
              {complaints.slice(0, 5).map((c) => (
                <li key={c.odiNumber}>
                  <ComplaintItem
                    complaint={{
                      odiNumber: String(c.odiNumber),
                      date: formatNhtsaDate(c.dateComplaintFiled || c.dateOfIncident),
                      summary: c.summary,
                      flags: {
                        crash: c.crash,
                        fire: c.fire,
                        injury: c.numberOfInjuries > 0,
                      },
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {safetyRatings.length > 0 ? (
          <section id="safety" className="mt-12">
            <h2 className="text-h2 text-slate-950">Safety ratings</h2>
            <p className="mt-1 text-sm text-muted">
              NHTSA 5-Star Safety Ratings (NCAP).
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {safetyRatings.map((s) => (
                <Card key={s.VehicleId}>
                  <h3 className="text-h3 text-slate-950">{s.VehicleDescription}</h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-muted">
                      Overall
                    </span>
                    <SafetyStars rating={s.OverallRating} size="md" />
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <RatingRow label="Front crash" value={s.OverallFrontCrashRating} />
                    <RatingRow label="Side crash" value={s.OverallSideCrashRating} />
                    <RatingRow label="Rollover" value={s.RolloverRating} />
                    <RatingRow label="Side pole" value={s.SidePoleCrashRating} />
                  </dl>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {epa && epa.combinedMin > 0 ? (
          <section id="epa" className="mt-12">
            <h2 className="text-h2 text-slate-950">EPA fuel economy</h2>
            <p className="mt-1 text-sm text-muted">
              Combined city + highway, across {epa.trims.length} trim
              {epa.trims.length === 1 ? "" : "s"}.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <MpgCard label="City" min={epa.cityMin} max={epa.cityMax} />
              <MpgCard label="Highway" min={epa.highwayMin} max={epa.highwayMax} />
              <MpgCard label="Combined" min={epa.combinedMin} max={epa.combinedMax} />
            </div>
          </section>
        ) : null}

        {(investigationCount > 0 || mfrComms.length > 0) ? (
          <section id="investigations" className="mt-12">
            <h2 className="text-h2 text-slate-950">
              Investigations &amp; technical bulletins
            </h2>
            <p className="mt-1 text-sm text-muted">
              {investigationCount} NHTSA defect investigation
              {investigationCount === 1 ? "" : "s"} ·{" "}
              {mfrComms.length} manufacturer communication
              {mfrComms.length === 1 ? "" : "s"} (TSB).
            </p>
            {investigationCount > 0 ? (
              <ul className="mt-4 space-y-2">
                {investigations.slice(0, 5).map((i) => (
                  <li
                    key={i.investigationNumber || i.subject}
                    className="rounded-card border border-border bg-surface p-4"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="vin-mono text-xs font-semibold text-[#7C3AED]">
                        {i.investigationNumber || "—"}
                      </span>
                      <span className="text-xs text-muted">
                        {i.status}
                        {i.openDate ? ` · ${formatNhtsaDate(i.openDate)}` : ""}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-950">
                      {i.subject}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        <section className="mt-12">
          <h2 className="text-h2 text-slate-950">Specs</h2>
          <p className="mt-1 text-sm text-muted">
            From NHTSA's vPIC decode of this VIN.
          </p>
          <Card className="mt-4">
            <SpecsGrid
              rows={[
                { label: "Engine", value: engineSpec(vinDecode) },
                { label: "Drivetrain", value: vinDecode.driveType },
                { label: "Transmission", value: vinDecode.transmissionStyle },
                { label: "Fuel", value: vinDecode.fuelTypePrimary },
                { label: "Body class", value: vinDecode.bodyClass },
                { label: "Doors", value: vinDecode.doors },
                { label: "Seats", value: vinDecode.seats },
                { label: "GVWR", value: vinDecode.gvwr },
                { label: "Series", value: vinDecode.series },
                { label: "Manufacturer", value: vinDecode.manufacturer },
                {
                  label: "Plant",
                  value: [vinDecode.plantCity, vinDecode.plantState, vinDecode.plantCountry]
                    .filter(Boolean)
                    .join(", "),
                },
              ]}
            />
          </Card>
        </section>

        <section className="mt-16 border-t border-border pt-10 text-center">
          <h2 className="text-h2 text-slate-950">Decode another VIN</h2>
          <p className="mt-1 text-sm text-muted">
            Drop in any 17-character VIN.
          </p>
          <div className="mx-auto mt-6 max-w-2xl">
            <VinSearchForm size="default" />
          </div>
          <p className="mt-4 text-xs text-muted">
            <Link href="/" className="hover:text-slate-950">
              ← Back to home
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}

// ============================================================
// Subviews
// ============================================================

function RatingRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <>
      <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className="text-right">
        <SafetyStars rating={value} size="sm" showLabel={false} />
      </dd>
    </>
  );
}

function MpgCard({ label, min, max }: { label: string; min: number; max: number }) {
  const display = min === max ? `${min}` : `${min}–${max}`;
  return (
    <Card className="text-center">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold text-brand-blue">
        {display}
        <span className="ml-1 text-sm font-medium text-muted">mpg</span>
      </p>
    </Card>
  );
}

function engineSpec(d: { engineDisplacementL: string; engineCylinders: string; engineHP: string }): string {
  const bits: string[] = [];
  if (d.engineDisplacementL) bits.push(`${parseFloat(d.engineDisplacementL).toFixed(1)}L`);
  if (d.engineCylinders) bits.push(`${d.engineCylinders}-cyl`);
  if (d.engineHP) bits.push(`${d.engineHP} hp`);
  return bits.join(" · ");
}

function DecodeFailed({ vin, errorText }: { vin: string; errorText: string }) {
  return (
    <div className="container-page py-12">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/", label: "VIN Decoder" },
          { label: vin },
        ]}
      />
      <div className="mx-auto mt-8 max-w-2xl text-center">
        <h1 className="text-h1-page text-slate-950">VIN not recognized</h1>
        <div className="mt-3">
          <VinDisplay vin={vin} />
        </div>
        {errorText ? (
          <p className="mt-4 text-sm text-muted">NHTSA: {errorText}</p>
        ) : (
          <p className="mt-4 text-sm text-muted">
            We couldn&rsquo;t decode this VIN. Double-check that you copied all
            17 characters — letters I, O, and Q are not used.
          </p>
        )}
        <div className="mx-auto mt-8 max-w-xl">
          <VinSearchForm size="default" />
        </div>
        <p className="mt-6 text-xs text-muted">
          <Link href="/" className="hover:text-slate-950">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
