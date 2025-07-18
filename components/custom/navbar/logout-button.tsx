"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenuItem } from "../../ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { DoorOpen } from "lucide-react";

export default function SidebarLogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  const qc = useQueryClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out", {
        position: "bottom-right",
      });
      console.error(error);
    } else {
      qc.removeQueries();
      toast.success("You've been logged out", {
        position: "bottom-right",
      });
      router.replace("/login");
    }
  };

  return (
    <DropdownMenuItem className="w-full" onClick={handleLogout}>
      <DoorOpen className="mr-2 h-4 w-4" />
      Sign out
    </DropdownMenuItem>
  );
}
