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
import { ClipboardList, House, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function ProjectSidebar() {
  const { projectID } = useParams();
  return (
    <Sidebar variant="floating" className="pt-12">
      {/* CONTENT */}
      <SidebarContent>
        {/* NAVIGATIONS */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/dashboard/projects/${projectID}`}
                    className="font-medium text-sm flex items-center gap-2"
                  >
                    <House className="w-10 h-10" />
                    Project Overview
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/dashboard/projects/${projectID}/field-reports`}
                    className="font-medium text-sm flex items-center gap-2"
                  >
                    <ClipboardList className="w-10 h-10" />
                    Field Reports
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/dashboard/projects/${projectID}/settings`}
                    className="font-medium text-sm flex items-center gap-2"
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
