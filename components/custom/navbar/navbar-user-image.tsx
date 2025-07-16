"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SidebarLogoutButton from "../../sidebar/logout-button";

export default function NavbarUserImage() {
  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: user }) => {
      if (user?.user?.user_metadata?.avatar_url) {
        setAvatarUrl(user.user.user_metadata.avatar_url);
      }
    });
  }, [avatarUrl]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          src={avatarUrl}
          alt="User Avatar"
          width={38}
          height={38}
          className="rounded-full"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <SidebarLogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
