"use server";
import { createClient } from "@/utils/supabase/server";
import { ActivityLogType } from "../../components/types";
import { headers } from "next/headers";

// ACTIVITY LOG ACTIONS
export async function InsertActivityLogAction(
  code: string,
  description: string,
  project_id?: string,
) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }
  // ✅ Get the user's IP address
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0] ||
    hdrs.get("x-real-ip") ||
    "Unknown";

  const { error } = await supabase.from("activity_logs").insert({
    code,
    description,
    project_location_id: project_id || null,
    ip_address: ip === "::1" ? "127.0.0.1" : ip,
    user_id: userData.user.id,
  });

  if (error) throw error;

  return;
}

export async function SelectActivityLogsByUserIDAction(user_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function SelectActivityLogsByProjectIDAction(project_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*, user:user_profile (fullname)")
    .eq("project_location_id", project_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function SelectAllActivityLogsAction() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*, user:user_profile (fullname)")
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }

  return data as ActivityLogType[];
}

export async function SelectAllActivityLogsByCurrentUserAction() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    throw userError;
  }
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data as ActivityLogType[];
}
