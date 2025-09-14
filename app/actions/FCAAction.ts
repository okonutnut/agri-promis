"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { FCAType } from "../../components/types";
import { InsertActivityLogAction } from "./ActivityLogAction";
import {
  SendPushNotificationToAllAction,
  SendPushNotificationToUserAction,
} from "./SubscriptionAction";

// FCA ACTIONS

export async function InsertFCAAction(data: FCAType) {
  const supabase = await createClient(cookies());
  const { id, ...rest } = data;
  const { error } = await supabase
    .from("farmers")
    .insert({ ...rest, active_status: 1 });

  if (error) {
    console.error("Error inserting FCA:", error);
    throw new Error(error.message);
  }

  // Log activity
  await InsertActivityLogAction(
    "Inserted new FCA record",
    `Inserted FCA: ${data.description}`
  );

  return;
}

export async function SelectAllFCAAction() {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase.from("farmers").select("*");

  if (error) {
    console.error("Error fetching all FCA:", error);
    throw new Error(error.message);
  }

  return data as FCAType[];
}

export async function SelectAllFCAByStatusAction(status: number) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("farmers")
    .select("*")
    .eq("active_status", status);

  if (error) {
    console.error("Error fetching FCA by status:", error);
    throw new Error(error.message);
  }

  return data as FCAType[];
}

export async function EditFCAAction(data: FCAType) {
  const supabase = await createClient(cookies());
  const { error } = await supabase
    .from("farmers")
    .update(data)
    .eq("id", data.id);

  if (error) {
    console.error("Error updating FCA:", error);
    throw new Error(error.message);
  }

  // Log activity
  await InsertActivityLogAction(
    "Updated FCA record",
    `Updated FCA: ${data.description}`
  );

  // Sent notification to all users
  await SendPushNotificationToUserAction(
    "d904c6a2-d586-435c-9ebd-0c4358df9119",
    "An FCA record has been updated."
  );

  return;
}

export async function EditFCAActiveStatusAction(fcaID: string, status: number) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("farmers")
    .update({ active_status: status })
    .eq("id", fcaID)
    .select()
    .single();

  if (error) {
    console.error("Error updating FCA:", error);
    throw new Error(error.message);
  }

  // Log activity
  await InsertActivityLogAction(
    "Updated FCA record",
    `Update ${data.description}'s active status to ${
      status == 0 ? "Inactive" : "Active"
    }`
  );

  return;
}

export async function SelectAllAssignedProjectsByFCAIDAction(fcaID: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("projects")
    .select("project_name, created_at")
    .contains("fca_ids", [fcaID]);

  if (error) {
    console.error("Error fetching assigned projects by FCA ID:", error);
    throw new Error(error.message);
  }

  return data;
}
