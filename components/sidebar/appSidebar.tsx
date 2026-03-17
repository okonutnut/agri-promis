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

type AppSidebarProps = {
  navItems: NavigationItemType[];
};

const ConnectionStatus = () => {
  const { connectionStatus } = useRealtimeQuery<unknown[]>({
    queryKey: ["connection-status-check"],
    table: "programs",
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return [];
    },
    staleTime: Infinity,
    retryAttempts: 0,
  });

  const statusConfig = {
    connected: { color: "bg-green-500", label: "Live" },
    connecting: { color: "bg-yellow-500", label: "Syncing" },
    disconnected: { color: "bg-gray-400", label: "Offline" },
    error: { color: "bg-red-500", label: "Error" },
  };

  const status = statusConfig[connectionStatus] || statusConfig.disconnected;

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
      <span className={`w-2 h-2 rounded-full ${status.color} ${connectionStatus === "connected" ? "animate-pulse" : ""}`} />
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
