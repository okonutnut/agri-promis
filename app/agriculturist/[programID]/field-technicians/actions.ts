"use server";

import { createClient } from "@/utils/supabase/server";
import { UserProfile } from "./types";

export async function InsertFieldTechnicianAction(data: UserProfile) {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: data.email as string,
      email_confirm: true,
      user_metadata: {
        name: data.fullname as string,
      },
    });

  if (authError) {
    console.error("Error creating user:", authError);
    throw new Error(`Failed to create user: ${authError.message}`);
  }

  const { error: userError } = await supabase.from("user_profile").insert({
    id: authData.user.id,
    fullname: data.fullname,
    role: "field_technician",
  });

  if (userError) {
    console.error("Error creating field technician:", userError);
    throw new Error(`Failed to create field technician: ${userError.message}`);
  }

  return;
}

export async function SelectAllFieldTechnicianAction() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("role", "field_technician");

  if (error) {
    console.error("Error fetching field technicians:", error);
    throw new Error(`Failed to fetch field technicians: ${error.message}`);
  }

  const result = data?.map((item) => ({
    ...item,
    role: item.role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char: string) => char.toUpperCase()),
  }));

  return result as UserProfile[];
}
