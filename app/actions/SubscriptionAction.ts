"use server";
import { createClient } from "@/utils/supabase/server";

export async function DeleteSubscrptionEndpoint() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return false;
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", userData.user.id);

  if (error) {
    return false;
  }

  return true;
}
