import { ImageResponse } from "next/og";

export const alt = "VinDecoder — Free VIN Decoder · NHTSA Recalls · Vehicle History";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
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
          padding: "72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: brand + URL */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              background: "#0F172A",
              border: "3px solid #1E293B",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 32 32">
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
          </div>
          <span style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            VinDecoder
          </span>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <span style={{ fontSize: "84px", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Free VIN Decoder
          </span>
          <span style={{ fontSize: "36px", color: "#94A3B8", lineHeight: 1.3 }}>
            NHTSA recalls · owner complaints · safety ratings · TSBs
          </span>
        </div>

        {/* Bottom: trust strip */}
        <div style={{ display: "flex", gap: "32px", fontSize: "22px", color: "#94A3B8" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#B91C1C", fontSize: "26px" }}>●</span> 100% free
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#B91C1C", fontSize: "26px" }}>●</span> Official NHTSA data
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#B91C1C", fontSize: "26px" }}>●</span> No signup
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
