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
import { BookUser, FileUser, House, MapPin, Plus } from "lucide-react";
import Image from "next/image";

export function AppSidebar() {
  const navigation = [
    { title: "Dashboard", icon: House, href: "/dashboard" },
    {
      title: "Field Technicians",
      icon: BookUser,
      href: "/field-technicians",
    },
    {
      title: "Farmers",
      icon: FileUser,
      href: "/farmers",
    },
    {
      title: "Locations",
      icon: MapPin,
      href: "/locations",
    },
  ];
  const programs = [{ title: "Corn Program", href: "/programs/corn" }];
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
        {/* NAVIGATIONS */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* PROGRAMS */}
        <SidebarGroup>
          <SidebarGroupLabel>Programs</SidebarGroupLabel>
          <SidebarGroupAction title="Add Project">
            <Plus /> <span className="sr-only">Add Programs</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {programs.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
