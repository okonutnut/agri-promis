"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { DoorOpen } from "lucide-react";

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
      toast.success("Logged out", {
        position: "bottom-right",
      });
      router.replace("/login");
    }
  };

  return (
    <DropdownMenuItem className="w-full" onClick={handleLogout}>
      <DoorOpen className="w-4 h-4 mr-2" />
      <span>Sign out</span>
    </DropdownMenuItem>
  );
}
