import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS | Travel Order",
  description: "Travel Order page for Agri-ProMIS",
};

export default function TravelOrderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
