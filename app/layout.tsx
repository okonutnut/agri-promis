import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/components/reactQueryProvider";
import AuthRedirect from "@/components/auth/auth-redirect";

export const metadata: Metadata = {
  title: "Agri-ProMIS",
  description: "Login page for Agri-ProMIS",
};

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppines",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ReactQueryProvider>
          <Toaster richColors position="bottom-right" />
          <AuthRedirect>{children}</AuthRedirect>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
