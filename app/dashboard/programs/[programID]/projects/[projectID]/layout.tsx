import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS | View Project",
  description: "Dashboard page for Agri-ProMIS",
};

export default function ProgramLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
