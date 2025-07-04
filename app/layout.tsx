import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agri-ProMIS",
  description: "Login page for Agri-ProMIS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-inter antialiased"
      >
        {children}
      </body>
    </html>
  );
}
