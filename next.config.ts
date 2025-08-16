// @ts-check
// next.config.ts
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
});

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      { protocol: "https", hostname: "aawvhtjwzyxsfyikmeis.supabase.co" },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
};

export default withBundleAnalyzer({ enabled: !!process.env.ANALYZE })(
  withPWA(nextConfig)
);
