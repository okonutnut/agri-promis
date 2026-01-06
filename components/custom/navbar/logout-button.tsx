"use client";

import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { DropdownMenuItem } from "../../ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { DoorOpen } from "lucide-react";
import { useState } from "react";
import LoadingPage from "../layout/loading-page";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";

export default function SidebarLogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const qc = useQueryClient();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error("Error logging out");

      // Clean up and redirect
      qc.removeQueries();
      toast.success("You've been logged out");
      window.location.href = "/login";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    <LoadingPage />;
  }

  return (
    <DropdownMenuItem onClick={handleLogout} className="text-xs">
      <DoorOpen className="h-2 w-2" />
      Sign out
    </DropdownMenuItem>
  );
}
