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
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";

type AppSidebarProps = {
  navItems: NavigationItemType[];
};

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

const ConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const isUnmounted = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const supabase = createClient();
    const channel = supabase.channel("connection-check");

    channel
      .on("presence", { event: "sync" }, () => {
        if (!isUnmounted.current) {
          setStatus("connected");
        }
      })
      .subscribe((state) => {
        if (isUnmounted.current) return;
        
        if (state === "SUBSCRIBED") {
          setStatus("connected");
        } else if (state === "CHANNEL_ERROR" || state === "TIMED_OUT") {
          setStatus("error");
        } else if (state === "CLOSED") {
          setStatus("disconnected");
        }
      });

    const handleOnline = () => setStatus("connecting");
    const handleOffline = () => setStatus("disconnected");
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      isUnmounted.current = true;
      supabase.removeChannel(channel);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const statusConfig = {
    connected: { color: "bg-green-500", label: "Live" },
    connecting: { color: "bg-yellow-500", label: "Syncing" },
    disconnected: { color: "bg-gray-400", label: "Offline" },
    error: { color: "bg-red-500", label: "Error" },
  };

  const currentStatus = statusConfig[status] || statusConfig.disconnected;

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
      <span className={`w-2 h-2 rounded-full ${currentStatus.color} ${status === "connected" ? "animate-pulse" : ""}`} />
      <span>{currentStatus.label}</span>
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
