import { ImageResponse } from "next/og";
import { getVinPageData } from "@/lib/nhtsa";
import { isValidVin, titleCase, slugify } from "@/lib/utils";
import { MAKES_WITH_LOGO } from "@/lib/makeLogos";

// Cache the OG payload for 7 days — matches our DB cache TTL, and OG
// crawlers should reuse the same image for repeated social shares.
export const revalidate = 604800;

export const alt = "VIN decoder report";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { vin: string };

export default async function VinOG({ params }: { params: Promise<Params> }) {
  const { vin } = await params;
  const upper = vin.toUpperCase();
  if (!isValidVin(upper)) {
    return fallback("Invalid VIN");
  }
  const data = await getVinPageData(upper).catch(() => null);
  if (!data || !data.vinDecode.make) {
    return fallback("VIN not recognized");
  }

  const make = titleCase(data.vinDecode.make);
  const model = data.vinDecode.model;
  const year = data.vinDecode.modelYear;
  const recalls = data.recalls.length;
  const complaints = data.complaints.length;
  const safety = data.safetyRatings[0]?.OverallRating;
  const star = safety && /^[1-5]$/.test(safety) ? `${safety}★` : null;
  const heroTitle = `${year} ${make} ${model}`;
  const makeSlug = slugify(make);
  const logoUrl = MAKES_WITH_LOGO.has(makeSlug)
    ? `https://vindecoder.site/logos/${makeSlug}.png`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top row: brand + logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <svg width="44" height="44" viewBox="0 0 32 32">
              <rect x="2" y="2" width="28" height="28" rx="6" fill="#1E293B" />
              <path
                d="M10 11 L16 21 L22 11"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="16" cy="25.5" r="1.6" fill="#B91C1C" />
            </svg>
            <span style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              VinDecoder
            </span>
          </div>
          {logoUrl ? (
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "16px 24px",
                display: "flex",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt={make} height={64} />
            </div>
          ) : null}
        </div>

        {/* Middle: year/make/model */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span
            style={{
              fontSize: "82px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {heroTitle}
          </span>
          <span style={{ fontSize: "26px", color: "#94A3B8", fontFamily: "ui-monospace, monospace" }}>
            VIN {upper}
          </span>
        </div>

        {/* Bottom: 3 metrics */}
        <div style={{ display: "flex", gap: "32px" }}>
          <Metric value={recalls} label={recalls === 1 ? "Recall" : "Recalls"} tone="#EF4444" />
          <Metric value={complaints} label={complaints === 1 ? "Complaint" : "Complaints"} tone="#F59E0B" />
          <Metric value={star ?? "—"} label="Safety" tone="#3B82F6" />
        </div>
      </div>
    ),
    { ...size },
  );
}

function Metric({
  value,
  label,
  tone,
}: {
  value: string | number;
  label: string;
  tone: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#1E293B",
        border: `2px solid ${tone}33`,
        borderRadius: "16px",
        padding: "20px 28px",
        minWidth: "180px",
      }}
    >
      <span style={{ fontSize: "56px", fontWeight: 800, color: tone, lineHeight: 1 }}>
        {value}
      </span>
      <span
        style={{
          marginTop: "6px",
          fontSize: "18px",
          color: "#94A3B8",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function fallback(text: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F172A",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "64px",
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {text}
      </div>
    ),
    { ...size },
  );
}
