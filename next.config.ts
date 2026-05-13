import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/admin", destination: "/", permanent: true },
      { source: "/admin/:path*", destination: "/", permanent: true },
      { source: "/specs", destination: "/", permanent: true },
      { source: "/specs/:path*", destination: "/", permanent: true },
      { source: "/license-plate", destination: "/", permanent: true },
      { source: "/license-plate/:path*", destination: "/", permanent: true },
      { source: "/compare", destination: "/", permanent: true },
      { source: "/compare/:path*", destination: "/", permanent: true },
      { source: "/problems", destination: "/recalls", permanent: true },
      { source: "/problems/:path*", destination: "/recalls", permanent: true },
    ];
  },
};

export default nextConfig;
