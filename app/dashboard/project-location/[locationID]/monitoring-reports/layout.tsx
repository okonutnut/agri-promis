import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS | Monitoring Reports",
  description: "Dashboard page for Agri-ProMIS",
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
