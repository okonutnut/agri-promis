"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function NavbarUserImage() {
  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: user }) => {
      if (user?.user?.user_metadata?.avatar_url) {
        setAvatarUrl(user.user.user_metadata.avatar_url);
      }
    });
  }, []);

  return (
    <Image
      src={avatarUrl}
      alt="User Avatar"
      width={35}
      height={35}
      className="rounded-full"
    />
  );
}
