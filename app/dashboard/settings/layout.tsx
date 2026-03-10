import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS | Settings",
  description: "Settings for Agri-ProMIS",
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
