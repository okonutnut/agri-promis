"use server";

import { createClient } from "@/utils/supabase/server";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { TravelOrderType } from "../../components/types";
import { sendNotificationToUser } from "./NotificationAction";

// TRAVEL ORDER ACTIONS
export async function InsertTravelOrderAction(data: TravelOrderType) {
  const supabase = await createClient();
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
      })),
    );

  if (itineraryError) {
    throw itineraryError;
  }

  // Fetch user profile for logging (non-critical, don't fail if this errors)
  let userProfileFullname = "User";
  try {
    const { data: userProfile } = await supabase
      .from("user_profile")
      .select("fullname")
      .eq("id", data.user_id)
      .single();

    if (userProfile?.fullname) {
      userProfileFullname = userProfile.fullname;
    }
  } catch (error) {
    // Log error but don't fail the operation
    console.error("Failed to fetch user profile for logging:", error);
  }

  // Log the activity (non-critical, don't fail if this errors)
  try {
    await InsertActivityLogAction(
      "Created a Travel Order",
      `Travel order for ${userProfileFullname} has been created.`,
    );
  } catch (error) {
    // Log error but don't fail the operation
    console.error("Failed to log activity:", error);
  }

  // Send Notification (non-critical, don't fail if this errors)
  try {
    await sendNotificationToUser(
      `Your travel order has been created successfully.`,
      user!.id,
    );
  } catch (error) {
    // Log error but don't fail the operation
    console.error("Failed to send notification:", error);
  }

  return TOData;
}

export async function SelectAllTravelOrdersByUserIDAction(userID?: string) {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  let user_id = userID ? userID : user?.id;

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
      travel_itinerary:travel_order_itinerary_items(
        id,
        date,
        end_date,
        destination,
        purpose,
        departure_time,
        arrival_time
      ),
      programs:programs!travel_order_program_id_fkey(program_name)
    `,
    )
    .eq("user_id", user_id)
    .eq("is_active", 1)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function SelectAllTravelOrdersByProgramIDAction(
  programID: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("travel_order")
    .select(
      `
      *,
      user:user_profile!travel_order_user_id_fkey(fullname),
      created_by:user_profile!travel_order_created_by_fkey(fullname),
      travel_itinerary:travel_order_itinerary_items(*)
    `,
    )
    .eq("program_id", programID)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function CheckTravelOrderLinkedAction(travelOrderId: string) {
  const supabase = await createClient();

  const { count: monitoringCount, error: monitoringError } = await supabase
    .from("monitoring")
    .select("id", { count: "exact", head: true })
    .eq("travel_order_no", travelOrderId);

  if (monitoringError) throw monitoringError;

  const { count: postTravelCount, error: postTravelError } = await supabase
    .from("post_travel")
    .select("id", { count: "exact", head: true })
    .eq("travel_order_id", travelOrderId);

  if (postTravelError) throw postTravelError;

  const linkedTo: string[] = [];
  if ((monitoringCount ?? 0) > 0) linkedTo.push("Monitoring Report");
  if ((postTravelCount ?? 0) > 0) linkedTo.push("Travel Report");

  return {
    isLinked: linkedTo.length > 0,
    linkedTo,
  };
}

export async function UpdateTravelOrderAction(
  id: string,
  data: TravelOrderType,
) {
  const supabase = await createClient();

  const { travel_itinerary, ...rest } = data;

  const { data: updated, error } = await supabase
    .from("travel_order")
    .update({ ...rest })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Replace itinerary: delete old items then insert latest items
  const { error: deleteItineraryError } = await supabase
    .from("travel_order_itinerary_items")
    .delete()
    .eq("travel_order_id", id);

  if (deleteItineraryError) throw deleteItineraryError;

  if (travel_itinerary && travel_itinerary.length > 0) {
    const payload = travel_itinerary.map((item) => ({
      date: item.date,
      end_date: item.end_date,
      destination: item.destination,
      purpose: item.purpose,
      departure_time: item.departure_time,
      arrival_time: item.arrival_time,
      travel_order_id: id,
    }));

    const { error: insertItineraryError } = await supabase
      .from("travel_order_itinerary_items")
      .insert(payload);

    if (insertItineraryError) throw insertItineraryError;
  }

  // Activity log is non-critical
  try {
    await InsertActivityLogAction(
      "Updated a Travel Order",
      `Travel order ${data.travel_order_no} has been updated.`,
    );
  } catch (error) {
    console.error("Failed to log activity:", error);
  }

  return updated;
}
