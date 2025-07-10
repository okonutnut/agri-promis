"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BookUser,
  ChevronsUpDown,
  ChevronUp,
  FileUser,
  House,
  MapPin,
  Plus,
  BarChart,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import NavbarUserImage from "../custom/navbar-user-image";
import SidebarLogoutButton from "./sidebar-logout-button";
import SidebarLinks from "@/configs/sidebar-link.json";
import Link from "next/link";
import { useParams } from "next/navigation";
import SidebarHeaderItems from "./sidebar-header-items";

// Icon mapping object
const iconMap = {
  BookUser,
  ChevronsUpDown,
  ChevronUp,
  FileUser,
  House,
  MapPin,
  Plus,
  BarChart,
  Users,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || House;
};

export function AppSidebar() {
  const { programID } = useParams();

  const navigation = SidebarLinks["agriculturist"].navigations;
  return (
    <Sidebar>
      {/* HEADER */}
      <SidebarHeaderItems programID={programID as string} />

      {/* CONTENT */}
      <SidebarContent className="border-y border-slate-200 overflow-y-auto relative">
        {/* NAVIGATIONS */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const IconComponent = getIcon(item.icon);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Link href={item.path}>
                        <IconComponent className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* PROJECTS */}
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction title="Add Project">
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* {projects.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild>
                        <Link href={item.path}>
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))} */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-center text-gray-500">
            Please select a program to view navigation.
          </p>
        </div>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-10 py-6">
                  <NavbarUserImage /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                style={{ width: "var(--radix-popper-anchor-width)" }}
                className="min-w-0 p-0"
              >
                <SidebarLogoutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
