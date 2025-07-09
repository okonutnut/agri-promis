"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchProgramsByAgriculturist() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError?.message || "User not found" };
  }

  const { data, error } = await supabase
    .from("programs")
    .select("program_name, id")
    .eq("agriculturist_id", userData.user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching programs:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
