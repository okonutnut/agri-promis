"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ClipboardList, House, Settings } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function ProjectSidebar() {
  const { projectID } = useParams();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar variant="floating" className="pt-12">
      {/* CONTENT */}
      <SidebarContent>
        {/* NAVIGATIONS */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(`/dashboard/projects/${projectID}`)}
                >
                  <Link
                    href={`/dashboard/projects/${projectID}`}
                    className="font-medium flex items-center gap-2"
                  >
                    <House className="w-10 h-10" />
                    Project Overview
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(
                    `/dashboard/projects/${projectID}/field-reports`
                  )}
                >
                  <Link
                    href={`/dashboard/projects/${projectID}/field-reports`}
                    className="font-medium flex items-center gap-2"
                  >
                    <ClipboardList className="w-10 h-10" />
                    Field Reports
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(
                    `/dashboard/projects/${projectID}/settings`
                  )}
                >
                  <Link
                    href={`/dashboard/projects/${projectID}/settings`}
                    className="font-medium flex items-center gap-2"
                  >
                    <Settings className="w-10 h-10" />
                    Project settings
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
