import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/components/reactQueryProvider";
import AuthRedirect from "@/components/auth/auth-redirect";

export const metadata: Metadata = {
  title: "Agri-ProMIS",
  description: "Login page for Agri-ProMIS",
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
          <Toaster richColors position="top-right" />
          <AuthRedirect>{children}</AuthRedirect>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
