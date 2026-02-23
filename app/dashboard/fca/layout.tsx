import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Agri-ProMIS | Farmers",
  description: "Farmers page for Agri-ProMIS",
};

export default function FarmersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
