"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { TravelOrderType } from "../../components/types";
import { sendNotificationToUser } from "./NotificationAction";

// TRAVEL ORDER ACTIONS
export async function InsertTravelOrderAction(data: TravelOrderType) {
  const supabase = await createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Insert travel order
  const { travel_itinerary, ...rest } = data;
  const { data: TOData, error } = await supabase
    .from("travel_order")
    .insert({
      ...rest,
      is_active: 1,
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Insert Travel Itinerary
  const { error: itineraryError } = await supabase
    .from("travel_order_itinerary_items")
    .insert(
      travel_itinerary.map((item) => ({
        ...item,
        travel_order_id: TOData.id,
      }))
    );

  if (itineraryError) {
    throw itineraryError;
  }

  // Fetch user profile for logging
  const { data: userProfile, error: profileError } = await supabase
    .from("user_profile")
    .select("fullname")
    .eq("id", data.user_id)
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
  await sendNotificationToUser(
    `Your travel order has been created successfully.`,
    user!.id
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
      `
      *,
      user:user_profile!travel_order_user_id_fkey(fullname),
      created_by:user_profile!travel_order_created_by_fkey(fullname),
      travel_itinerary:travel_order_itinerary_items(*)
    `
    )
    .eq("user_id", user_id)
    .eq("is_active", 1)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function SelectAllTravelOrdersByProgramIDAction(
  programID: string
) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("travel_order")
    .select(
      `
      *,
      user:user_profile!travel_order_user_id_fkey(fullname),
      created_by:user_profile!travel_order_created_by_fkey(fullname),
      travel_itinerary:travel_order_itinerary_items(*)
    `
    )
    .eq("program_id", programID)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}
