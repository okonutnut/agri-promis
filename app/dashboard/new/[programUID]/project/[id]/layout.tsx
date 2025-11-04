import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS | New Location",
  description: "Dashboard page for Agri-ProMIS",
};

export default function CreateProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="w-full h-screen relative">{children}</main>;
}
