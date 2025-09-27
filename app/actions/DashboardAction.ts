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
    throw APError;
  }

  // 2. total monitoring reports
  const { data: MData, error: MError } = await supabase
    .from("monitoring")
    .select("*")
    .eq("project_id", projectID);
  if (MError) {
    throw MError;
  }

  // 3. project progress indicator
  const { data: PData, error: projectError } = await supabase
    .from("projects")
    .select("progress_indicator")
    .eq("id", projectID)
    .single();
  if (projectError) {
    throw projectError;
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
    throw userError;
  }

  // Get travel orders
  const { data: TData, error: TError } = await supabase
    .from("travel_order")
    .select("*")
    .eq("user_id", userData.user.id)
    .gte("return_date", new Date().toISOString())
    .order("created_at", { ascending: false });
  if (TError) {
    throw TError;
  }

  // Get assigned projects
  const { data: APData, error: APError } = await supabase
    .from("assigned_projects")
    .select("*")
    .eq("user_id", userData.user.id);
  if (APError) {
    throw APError;
  }

  // Get monitoring reports
  const { data: MData, error: MError } = await supabase
    .from("monitoring")
    .select("*")
    .eq("reporter_id", userData.user.id);
  if (MError) {
    throw MError;
  }

  // Get activity logs
  const { data: ALData, error: ALError } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(10);
  if (ALError) {
    throw ALError;
  }

  return { ap: APData, m: MData, to: TData, al: ALData };
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

  const nowDate = new Date().toISOString().split("T")[0]; // e.g. "2025-09-18"

  const { data: futureOrders } = await supabase
    .from("travel_order_projects")
    .select(
      `
    *,
    travel_order (
      travel_order_no,
      user_profile: user_id (
        fullname
      ),
      projects: project_id (
        project_name
      )
    )
  `
    )
    .eq("date", nowDate)
    .limit(5);

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
    throw userError;
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
    throw futureError;
  }

  return futureOrders;
}
