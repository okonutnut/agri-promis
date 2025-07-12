"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function SidebarLogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out", {
        position: "bottom-right",
      });
      console.error(error);
    } else {
      toast.success("You've been logged out", {
        position: "bottom-right",
      });
      router.replace("/login");
    }
  };

  return (
    <DropdownMenuItem className="w-full text-xs" onClick={handleLogout}>
      Sign out
    </DropdownMenuItem>
  );
}
