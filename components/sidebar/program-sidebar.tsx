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
import { Boxes, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function ProgramSidebar() {
  const { programID } = useParams();
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
                    href={"/dashboard/programs/" + programID}
                    className="font-medium text-sm flex items-center gap-2"
                  >
                    <Boxes className="w-10 h-10" />
                    Projects
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/dashboard/programs/${programID}/field-technicians`}
                    className="font-medium text-sm flex items-center gap-2"
                  >
                    <Users className="w-10 h-10" />
                    Team
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/dashboard/programs/${programID}/settings`}
                    className="font-medium text-sm flex items-center gap-2"
                  >
                    <Settings className="w-10 h-10" />
                    Program settings
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
