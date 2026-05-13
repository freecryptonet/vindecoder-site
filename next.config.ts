import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Force HTTPS for the next year; includes subdomains (staging is also TLS).
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Prevent MIME sniffing.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Block being iframed except by us (prevents clickjacking).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Conservative referrer leak policy.
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Drop browser features we don't use — defense-in-depth.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Old admin/closed-loop routes: gone for good. Land users on the homepage.
      { source: "/admin", destination: "/", permanent: true },
      { source: "/admin/:path*", destination: "/", permanent: true },

      // /compare: feature was abandoned in the rebuild, no equivalent. Home.
      { source: "/compare", destination: "/", permanent: true },
      { source: "/compare/:path*", destination: "/", permanent: true },

      // /specs root: no dedicated landing yet; punt to homepage.
      { source: "/specs", destination: "/", permanent: true },
      { source: "/specs/:path*", destination: "/", permanent: true },

      // /problems root: legacy aggregate page → send to /recalls (closest).
      { source: "/problems", destination: "/recalls", permanent: true },
      // NOTE: don't blanket-match /problems/:path* — the per-state strings
      // shouldn't collide, and we want /makes/.../problems handled below.

      // /makes/[make]/[model]/[year]/problems was a pre-rebuild route Google
      // indexed at positions 4–17. We don't have a dedicated /problems page
      // per year (yet); year hub renders the same data so redirect there.
      {
        source: "/makes/:make/:model/:year/problems",
        destination: "/makes/:make/:model/:year",
        permanent: true,
      },
      // /makes/[make]/[model]/[year]/recalls — same situation.
      {
        source: "/makes/:make/:model/:year/recalls",
        destination: "/makes/:make/:model/:year",
        permanent: true,
      },
      // /makes/[make]/[model]/problems → model hub (no year).
      {
        source: "/makes/:make/:model/problems",
        destination: "/makes/:make/:model",
        permanent: true,
      },
      // /makes/[make]/problems → make hub.
      {
        source: "/makes/:make/problems",
        destination: "/makes/:make",
        permanent: true,
      },

      // /complaints/[odiNumber] was indexed pre-rebuild; we have no detail
      // page now (only the /complaints index). Redirect to the index — better
      // than 404, preserves a slice of link equity.
      {
        source: "/complaints/:odi",
        destination: "/complaints",
        permanent: true,
      },

      // NOTE: /license-plate and /license-plate/[state] are NOT redirected —
      // we now serve real per-state landing pages (50 states + DC).
    ];
  },
};

export default nextConfig;
