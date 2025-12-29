import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/components/reactQueryProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import PWA from "@/components/pwa";
import PermissionChecker from "@/components/custom/permissions/permission-checker";

export const metadata: Metadata = {
  title: "Agri-ProMIS",
  description: "Login page for Agri-ProMIS",
  manifest: "/manifest",
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
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Agri-ProMIS" />
        {/* Load Google Font via CSS link instead of next/font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
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
