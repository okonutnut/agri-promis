// @ts-check
// next.config.ts
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const runtimeCaching = [
  {
    urlPattern: /^\/dashboard\/programs\/[^/]+$/,
    handler: "NetworkFirst",
    options: {
      cacheName: "programs-cache",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      },
      networkTimeoutSeconds: 10,
    },
  },
  {
    urlPattern: /^\/dashboard\/programs\/[^/]+\/travel-order$/,
    handler: "NetworkFirst",
    options: {
      cacheName: "travel-order-cache",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      },
      networkTimeoutSeconds: 10,
    },
  },
  {
    urlPattern: /^\/dashboard\/projects\/[^/]+$/,
    handler: "NetworkFirst",
    options: {
      cacheName: "projects-cache",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      },
      networkTimeoutSeconds: 10,
    },
  },
  {
    urlPattern: /^\/dashboard\/projects\/[^/]+\/field-technicians$/,
    handler: "NetworkFirst",
    options: {
      cacheName: "field-technicians-cache",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      },
      networkTimeoutSeconds: 10,
    },
  },
  {
    urlPattern: /^\/dashboard\/projects\/[^/]+\/settings$/,
    handler: "NetworkFirst",
    options: {
      cacheName: "project-settings-cache",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      },
      networkTimeoutSeconds: 10,
    },
  },
  {
    urlPattern: /^\/field-technician\/projects\/[^/]+$/,
    handler: "NetworkFirst",
    options: {
      cacheName: "field-technician-projects-cache",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      },
      networkTimeoutSeconds: 10,
    },
  },
  {
    urlPattern: /^\/dashboard\/new\/[^/]+$/,
    handler: "NetworkFirst",
    options: {
      cacheName: "new-project-cache",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      },
      networkTimeoutSeconds: 10,
    },
  },
];

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  disabled: true,
  workboxOptions: { runtimeCaching },
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
