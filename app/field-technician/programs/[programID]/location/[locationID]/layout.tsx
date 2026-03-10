import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS | Project Overview",
  description: "Dashboard page for Agri-ProMIS",
};

export default function FieldTechnicianOverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full relative">
      {children}
    </main>
  );
}
