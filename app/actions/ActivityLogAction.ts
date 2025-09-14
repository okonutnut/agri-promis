"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ActivityLogType } from "../../components/types";

// ACTIVITY LOG ACTIONS
export async function InsertActivityLogAction(
  code: string,
  description: string,
  project_id?: string
) {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error();
  }
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();

  const { error } = await supabase.from("activity_logs").insert({
    code,
    description,
    project_id: project_id || null,
    user_id: userData.user.id,
    ip_address: data.ip,
  });

  if (error) {
    throw new Error();
  }

  return;
}

export async function SelectActivityLogsByUserIDAction(user_id: string) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error();
  }

  return data;
}

export async function SelectActivityLogsByProjectIDAction(project_id: string) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*, user:user_profile (fullname)")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error();
  }

  return data;
}

export async function SelectAllActivityLogsAction() {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*, user:user_profile (fullname)")
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error();
  }

  return data as ActivityLogType[];
}

export async function SelectAllActivityLogsByCurrentUserAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    throw new Error();
  }
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error();
  }
  return data as ActivityLogType[];
}
