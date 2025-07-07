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
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  FileUser,
  House,
  MapPin,
  Monitor,
  Plus,
  User2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-10 py-6">
                  <Monitor className="mr-2" />
                  <div className="text-xs flex flex-col items-start gap-1 font-semibold">
                    Corn Distribution
                    <span className="font-normal">Program</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-0 w-[var(--radix-popper-anchor-width)]"
                align="start"
              >
                <DropdownMenuItem className="w-full">
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full">
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
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

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                style={{ width: "var(--radix-popper-anchor-width)" }}
                className="min-w-0 p-0"
              >
                <DropdownMenuItem className="w-full">
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full">
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full">
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
