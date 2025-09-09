"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SidebarLogoutButton from "./logout-button";
import {
  useSelectCurrentUserSessionHook,
  useSelectUserProfileHook,
} from "@/app/hooks/UserProfileHook";
import { TabletSmartphone } from "lucide-react";
import Link from "next/link";

export default function NavbarUserImage() {
  const { data } = useSelectUserProfileHook();
  const { data: session } = useSelectCurrentUserSessionHook();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Image
          src={
            session?.user?.user_metadata?.avatar_url || "/default-avatar.png"
          }
          alt="User Avatar"
          width={33}
          height={33}
          className="rounded-full"
          priority
          fetchPriority="high"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1">
        <DropdownMenuLabel className="p-0 cursor-default space-x-0 flex flex-col items-start">
          <span className="text-xs">{data?.fullname}</span>
          <span className="text-xs">{data?.position}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={"/mobile-app"}>
          <DropdownMenuItem className="text-xs">
            <TabletSmartphone className="h-2 w-2" />
            Mobile App
          </DropdownMenuItem>
        </Link>
        <SidebarLogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
