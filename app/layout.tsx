import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Agri-ProMIS",
  description: "Login page for Agri-ProMIS",
};

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
