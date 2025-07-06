import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/custom/navbar";

export const metadata: Metadata = {
  title: "Agri-ProMIS - Field Technicians",
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
      <main className="w-full h-screen relative">
        <Navbar pageTitle="Field Technicians" />
        {children}
      </main>
    </SidebarProvider>
  );
}
