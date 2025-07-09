"use client";

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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import NavbarUserImage from "../custom/navbar-user-image";
import SidebarLogoutButton from "./sidebar-logout-button";
import SidebarLinks from "@/configs/sidebar-link.json";
import { useQuery } from "@tanstack/react-query";
import { fetchProgramsByAgriculturist } from "@/app/actions/programs";
import { useState, useEffect } from "react";
import Link from "next/link";

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
  const navigation = SidebarLinks["agriculturist"].navigations;
  const projects = SidebarLinks["agriculturist"].projects;

  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  const { data: programData } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => await fetchProgramsByAgriculturist(),
  });

  useEffect(() => {
    if (programData?.data && programData.data.length > 0 && !selectedProgram) {
      setSelectedProgram(programData.data[0]);
    }
  }, [programData, selectedProgram]);

  const handleProgramSelect = (program: any) => {
    setSelectedProgram(program);
  };
  return (
    <Sidebar>
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-10 py-6">
                  <div className="text-xs flex flex-col items-start gap-1 font-semibold">
                    {selectedProgram ? (
                      <>
                        {selectedProgram.program_name}
                        <span className="font-normal">Program</span>
                      </>
                    ) : (
                      "Select Workplace"
                    )}
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-0 w-[var(--radix-popper-anchor-width)]"
                align="start"
              >
                {programData?.data?.map((program: any) => (
                  <DropdownMenuItem
                    key={program.id}
                    className="w-full"
                    onClick={() => handleProgramSelect(program)}
                  >
                    <div className="text-xs flex flex-col items-start gap-1 font-semibold">
                      {program.program_name}
                      <span className="font-normal">Program</span>
                    </div>
                    {selectedProgram?.id === program.id && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link
                    href={"/agriculturist/create-program"}
                    className="w-full border-t py-2 gap-2 text-xs flex items-start gap-1 font-semibold"
                  >
                    <Plus />
                    New Program
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="border-y border-slate-200 overflow-y-auto relative">
        {/* NAVIGATIONS */}
        {selectedProgram ? (
          <>
            {navigation.length > 0 && (
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
            )}

            {/* PROGRAMS */}
            {projects.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                <SidebarGroupAction title="Add Project">
                  <Plus /> <span className="sr-only">Add Project</span>
                </SidebarGroupAction>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {projects.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton asChild>
                          <Link href={item.path}>
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-center text-gray-500">
              Please select a program to view navigation.
            </p>
          </div>
        )}
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
