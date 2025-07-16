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
import { useParams, usePathname } from "next/navigation";

export function ProgramSidebar() {
  const { programID } = useParams();
  const pathname = usePathname();

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
                  isActive={pathname === `/dashboard/programs/${programID}`}
                >
                  <Link
                    href={"/dashboard/programs/" + programID}
                    className="font-medium flex items-center gap-2"
                  >
                    <Boxes className="w-10 h-10" />
                    Projects
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname === `/dashboard/programs/${programID}/team`
                  }
                >
                  <Link
                    href={`/dashboard/programs/${programID}/team`}
                    className="font-medium flex items-center gap-2"
                  >
                    <Users className="w-10 h-10" />
                    Team
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname === `/dashboard/programs/${programID}/settings`
                  }
                >
                  <Link
                    href={`/dashboard/programs/${programID}/settings`}
                    className="font-medium flex items-center gap-2"
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
