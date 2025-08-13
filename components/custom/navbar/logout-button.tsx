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
    try {
      // Sign out the user
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error("Error logging out");

      // Clean up and redirect
      qc.removeQueries();
      toast.success("You've been logged out");
      router.replace("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      console.error(error);
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className="text-xs">
      <DoorOpen className="h-2 w-2" />
      Sign out
    </DropdownMenuItem>
  );
}
