"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenuItem } from "../../ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SidebarLogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  const qc = useQueryClient();

  const handleLogout = async () => {
    try {
      // Get the current user
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error("Error fetching user data");

      // Delete the user session from the database
      const { error: sessionError } = await supabase
        .from("user_session")
        .delete()
        .eq("user_id", user?.user?.id);
      if (sessionError) throw new Error("Error deleting user session");

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
    <DropdownMenuItem asChild>
      <Button
        variant={"ghost"}
        className="w-full justify-start"
        onClick={handleLogout}
      >
        <DoorOpen className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </DropdownMenuItem>
  );
}
