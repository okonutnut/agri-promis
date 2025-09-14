"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { TravelOrderType } from "../../components/types";
import { SendPushNotificationToUserAction } from "./SubscriptionAction";

// TRAVEL ORDER ACTIONS
export async function InsertTravelOrderAction(data: TravelOrderType) {
  const supabase = await createClient(cookies());
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const { error } = await supabase.from("travel_order").insert({
    ...data,
    is_active: 1,
    created_by: user?.id,
  });

  if (error) {
    throw error;
  }

  // Fetch user profile for logging
  const { data: userProfile, error: profileError } = await supabase
    .from("user_profile")
    .select("fullname")
    .eq("id", user?.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Created a Travel Order",
    `Travel order for ${userProfile.fullname} has been created.`
  );

  // Send Notification
  await SendPushNotificationToUserAction(
    user?.id as string,
    `Your travel order with T.O no ${data.travel_order_no} has been created.`
  );

  return;
}

export async function SelectAllTravelOrdersByUserIDAction(user_id?: string) {
  const supabase = await createClient(cookies());
  if (!user_id) {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    user_id = userData.user.id;
  }

  const { data, error } = await supabase
    .from("travel_order")
    .select(
      `*, project:projects(id, project_name), user:user_profile!travel_order_user_id_fkey(fullname),
      created_by:user_profile!travel_order_created_by_fkey(fullname)`
    )
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as TravelOrderType[];
}

export async function SelectAllTravelOrdersByProgramIDAction(
  programID: string
) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("travel_order")
    .select(
      `*, project:projects(id, project_name), user:user_profile!travel_order_user_id_fkey(fullname),
      created_by:user_profile!travel_order_created_by_fkey(fullname)`
    )
    .eq("program_id", programID)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as TravelOrderType[];
}
