import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export const metadata: Metadata = {
  title: "Agri-ProMIS - Dashboard",
  description: "Dashboard page for Agri-ProMIS",
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen relative">{children}</main>
    </SidebarProvider>
  );
}
