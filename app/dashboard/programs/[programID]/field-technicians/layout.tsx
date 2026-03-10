import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS | Field Technicians",
  description: "Dashboard page for Agri-ProMIS",
};

export default function FieldTechnicianLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

