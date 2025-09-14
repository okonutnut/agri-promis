"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// DASHBOARD ACTIONS
export async function SelectDashboardItemsAction(projectID: string) {
  const supabase = await createClient(cookies());
  // 1. total assigned ft
  const { data: APData, error: APError } = await supabase
    .from("assigned_projects")
    .select("*")
    .eq("project_id", projectID);

  if (APError) {
    return Promise.reject();
  }

  // 2. total monitoring reports
  const { data: MData, error: MError } = await supabase
    .from("monitoring")
    .select("*")
    .eq("project_id", projectID);
  if (MError) {
    return Promise.reject();
  }

  // 3. project progress indicator
  const { data: PData, error: projectError } = await supabase
    .from("projects")
    .select("progress_indicator")
    .eq("id", projectID)
    .single();
  if (projectError) {
    return Promise.reject();
  }

  return {
    ap: APData,
    m: MData,
    pi: PData.progress_indicator,
  };
}

export async function SelectUserDashboardItemsAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return Promise.reject();
  }

  // Get travel orders
  const { data: TData, error: TError } = await supabase
    .from("travel_order")
    .select("*")
    .eq("user_id", userData.user.id)
    .gte("return_date", new Date().toISOString())
    .order("created_at", { ascending: false });
  if (TError) {
    return Promise.reject();
  }

  // Get assigned projects
  const { data: APData, error: APError } = await supabase
    .from("assigned_projects")
    .select("*")
    .eq("user_id", userData.user.id);
  if (APError) {
    return Promise.reject();
  }

  // Get monitoring reports
  const { data: MData, error: MError } = await supabase
    .from("monitoring")
    .select("*")
    .eq("reporter_id", userData.user.id);
  if (MError) {
    return Promise.reject();
  }

  return { ap: APData, m: MData, to: TData };
}

export async function SelectAdminDashboardItemsAction() {
  const supabase = await createClient(cookies());

  const { count: userCount } = await supabase
    .from("user_profile")
    .select("*", { count: "exact", head: true });

  const { count: programCount } = await supabase
    .from("programs")
    .select("*", { count: "exact", head: true });

  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const today = new Date().toISOString().split("T")[0];
  const todayStart = `${today}T00:00:00`;

  const { data: futureOrders } = await supabase
    .from("travel_order")
    .select(
      "*, user:user_profile!travel_order_user_id_fkey (fullname), projects (project_name)"
    )
    .or(`departure_date.gte.${todayStart},return_date.gte.${todayStart}`)
    .limit(10);

  const { data: activityLogs } = await supabase
    .from("activity_logs")
    .select("*, user:user_profile (fullname)")
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    totalUsers: userCount ?? 0,
    totalPrograms: programCount ?? 0,
    totalProjects: projectCount ?? 0,
    recentActivityLogs: activityLogs ?? [],
    futureTravelOrders: futureOrders ?? [],
  };
}

export async function SelectTravelOrdersByDateAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return Promise.reject();
  }

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const todayStart = `${today}T00:00:00`;
  // Fetch future travel orders based on departure_date or return_date
  const { data: futureOrders, error: futureError } = await supabase
    .from("travel_order")
    .select("*, user:user_profile!travel_order_user_id_fkey (fullname)")
    .or(`departure_date.gte.${todayStart},return_date.gte.${todayStart}`)
    .limit(10);

  if (futureError) {
    return Promise.reject();
  }

  return futureOrders;
}
