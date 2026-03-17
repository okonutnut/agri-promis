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
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllProgramsWithProjectsAction } from "@/app/actions/ProgramAction";

type AppSidebarProps = {
  navItems: NavigationItemType[];
};

const ConnectionStatus = () => {
  const { connectionStatus } = useRealtimeQuery<unknown[]>({
    queryKey: ["connection-status-check"],
    table: "programs",
    queryFn: () => SelectAllProgramsWithProjectsAction(),
    staleTime: Infinity,
  });

  const statusConfig = {
    connected: { color: "bg-green-500", text: "Connected", label: "Live" },
    connecting: { color: "bg-yellow-500", text: "Connecting...", label: "Connecting" },
    disconnected: { color: "bg-gray-400", text: "Offline", label: "Offline" },
    error: { color: "bg-red-500", text: "Connection Error", label: "Error" },
  };

  const status = statusConfig[connectionStatus] || statusConfig.disconnected;

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
      <span className={`w-2 h-2 rounded-full ${status.color} animate-pulse`} />
      <span>{status.label}</span>
    </div>
  );
};

export function AppSidebar({ navItems }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" className="pt-12">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.href === pathname}>
                    <Link
                      href={item.href}
                      className="font-medium flex items-center gap-2"
                      prefetch={true}
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
      <SidebarFooter>
        <ConnectionStatus />
      </SidebarFooter>
    </Sidebar>
  );
}
