"use server";
import { createClient } from "@/utils/supabase/server";

// PUSH SUBSCRIPTION ACTIONS
export async function DeleteSubscrptionEndpoint() {
  const supabase = await createClient();

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq(
      "user_id",
      await supabase.auth.getUser().then(({ data }) => data.user?.id)!,
    );

  if (error) {
    return false;
  }

  return true;
}
