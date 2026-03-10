import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS | Dashboard",
  description: "Dashboard page for Agri-ProMIS",
};

export default function ScheduleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
