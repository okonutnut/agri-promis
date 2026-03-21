import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/components/reactQueryProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import PWA from "@/components/pwa";
import PermissionChecker from "@/components/custom/permissions/permission-checker";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Agri-ProMIS",
  description: "Login page for Agri-ProMIS",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Agri-ProMIS",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icons/web-app-manifest-512x512.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Agri-ProMIS" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/ios/180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/ios/152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/ios/167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/ios/180.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/ios/192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/ios/512.png" />
        <link
          rel="apple-touch-startup-image"
          href="/icons/ios/1024.png"
        />
      </head>
      <body className={`${outfit.className} antialiased`}>
        <ReactQueryProvider>
          <Analytics />
          <SpeedInsights />
          <Toaster richColors position="top-center" />
          <SidebarProvider>{children}</SidebarProvider>
          <PWA />
          <PermissionChecker />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
