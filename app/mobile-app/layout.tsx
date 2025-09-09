import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS - Mobile App",
  description: "Dashboard page for Agri-ProMIS",
};

export default function CreateProgramLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="w-full h-screen relative">{children}</main>;
}
