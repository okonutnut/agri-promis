import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/components/reactQueryProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Agri-ProMIS",
  description: "Login page for Agri-ProMIS",
  manifest: "/manifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icons/web-app-manifest-512x512.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <ReactQueryProvider>
          <Toaster richColors position="top-center" />
          <SidebarProvider>{children}</SidebarProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
