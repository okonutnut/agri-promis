"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GetUserRole() {
  const supabase = createClient();
  const { data: user } = await (await supabase).auth.getUser();

  if (user) {
    const { data: userData } = await (await supabase)
      .from("user_profile")
      .select("*")
      .eq("id", user.user?.id)
      .single();
    if (userData) {
      if (userData.role === "agriculturist") {
        redirect("/agriculturist");
      } else if (userData.role === "field_technician") {
        redirect("/field-technicians");
      } else {
        redirect("/login");
      }
    }
  } else {
    redirect("/login");
  }
}

export async function IsUserExist() {
  const supabase = createClient();
  const { data: user } = await (await supabase).auth.getUser();

  if (user) {
    return true;
  }
  return false;
}
