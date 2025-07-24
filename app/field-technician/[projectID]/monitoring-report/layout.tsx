import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agri-ProMIS - Monitoring Reports",
  description: "Dashboard page for Agri-ProMIS",
};

export default function MonitoringReportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full relative">
      <SidebarProvider>{children}</SidebarProvider>
    </main>
  );
}
