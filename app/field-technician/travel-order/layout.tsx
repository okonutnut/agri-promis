import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Agri-ProMIS - Travel Order",
  description: "Travel Order page for Agri-ProMIS",
};

export default function TravelOrderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
