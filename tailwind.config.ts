import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#0F172A",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F8FAFC",
        },
        border: {
          DEFAULT: "#E2E8F0",
        },
        muted: {
          DEFAULT: "#64748B",
        },
        brand: {
          red: "#B91C1C",
          blue: "#1E40AF",
          orange: "#EA580C",
          green: "#059669",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        page: "1280px",
      },
      borderRadius: {
        card: "8px",
        btn: "6px",
        chip: "4px",
      },
      fontSize: {
        "h1-hero": ["3rem", { lineHeight: "1.1", fontWeight: "700" }],
        "h1-page": ["2rem", { lineHeight: "1.2", fontWeight: "700" }],
        "h2": ["1.375rem", { lineHeight: "1.3", fontWeight: "700" }],
        "h3": ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
