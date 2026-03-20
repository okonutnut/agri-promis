// @ts-check
// next.config.ts
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import path from "path";
import nextPWA from "@ducanh2912/next-pwa";

type ExtendedPWAOptions = {
  register?: boolean;
  skipWaiting?: boolean;
  fallbacks?: {
    document?: string;
  };
  dest: string;
  workboxOptions?: Record<string, unknown>;
};

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: "/~offline",
  },
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60,
          },
          networkTimeoutSeconds: 3,
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "static-images",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /\.(?:woff|woff2|ttf|otf)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "static-fonts",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /\/_next\/static\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "next-static",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },
    ],
  },
} as ExtendedPWAOptions);

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  output: "standalone",
  reactStrictMode: true,
  // Fix lockfile warning by explicitly setting the workspace root
  outputFileTracingRoot: path.resolve(process.cwd()),
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
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

const analyzed = withBundleAnalyzer({ enabled: !!process.env.ANALYZE });

// In production: always apply withPWA.
// In dev: always apply withPWA.
export default analyzed(withPWA(nextConfig));
