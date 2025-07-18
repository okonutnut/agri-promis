"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { NavigationItemType } from "../types";
import Link from "next/link";

type AppSidebarProps = {
  navItems: NavigationItemType[];
};
export function AppSidebar({ navItems }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" className="pt-12">
      {/* CONTENT */}
      <SidebarContent>
        {/* NAVIGATIONS */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.href === pathname}>
                    <Link
                      href={item.href}
                      className="font-medium flex items-center gap-2"
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
