"use server";

import { createClient } from "@/utils/supabase/server";
import { addFTType } from "./components/add-technician-form";

export async function InsertFieldTechnician(formData: addFTType) {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: formData.email as string,
      email_confirm: true,
      user_metadata: {
        name: formData.fullname as string,
      },
    });

  if (authError) {
    console.error("Error creating user:", authError);
    return { success: false, error: authError.message };
  }

  const { data: userData, error: userError } = await supabase
    .from("user_profile")
    .insert({
      id: authData.user.id,
      fullname: formData.fullname,
      role: "field_technician",
    })
    .select()
    .single();

  if (userError) {
    console.error("Error creating field technician:", userError);
    return { success: false, error: userError.message };
  }

  return { success: true, data: userData };
}
