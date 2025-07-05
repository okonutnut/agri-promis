import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { House, Plus } from "lucide-react";
import Image from "next/image";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-center border-b p-2">
        <span>
          <Image
            src="/logo.png"
            alt="logo"
            width={80}
            height={80}
            className="mx-auto"
          />
        </span>
        <h5 className="text-sm font-medium text-center">
          Agricultural Project Implementation &amp; Monitoring System
        </h5>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href={"/dashboard"}>
                  <House />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
