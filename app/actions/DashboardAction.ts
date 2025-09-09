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
    console.error(APError.message);
    throw new Error("Failed fetching assigned_projects");
  }

  // 2. total monitoring reports
  const { data: MData, error: MError } = await supabase
    .from("monitoring")
    .select("*")
    .eq("project_id", projectID);
  if (MError) {
    console.error(MError.message);
    throw new Error("Failed fetching monitoring reports");
  }

  // 3. project progress indicator
  const { data: PData, error: projectError } = await supabase
    .from("projects")
    .select("progress_indicator")
    .eq("id", projectID)
    .single();
  if (projectError) {
    console.error(projectError.message);
    throw new Error("Failed fetching project data");
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
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  // Get travel orders
  const { data: TData, error: TError } = await supabase
    .from("travel_order")
    .select("*")
    .eq("user_id", userData.user.id)
    .gte("return_date", new Date().toISOString())
    .order("created_at", { ascending: false });
  if (TError) {
    console.error(TError.message);
    throw new Error("Failed fetching travel orders");
  }

  // Get assigned projects
  const { data: APData, error: APError } = await supabase
    .from("assigned_projects")
    .select("*")
    .eq("user_id", userData.user.id);
  if (APError) {
    console.error(APError.message);
    throw new Error("Failed fetching assigned_projects");
  }

  // Get monitoring reports
  const { data: MData, error: MError } = await supabase
    .from("monitoring")
    .select("*")
    .eq("reporter_id", userData.user.id);
  if (MError) {
    console.error(MError.message);
    throw new Error("Failed fetching monitoring reports");
  }

  return { ap: APData, m: MData, to: TData };
}

export async function SelectAdminDashboardItemsAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  // Get total users
  const { data: userCount, error: userCountError } = await supabase
    .from("user_profile")
    .select("*", { count: "exact" });

  if (userCountError) {
    console.error("Error fetching user count:", userCountError);
    throw new Error(userCountError.message);
  }

  // Get total programs
  const { data: programCount, error: programCountError } = await supabase
    .from("programs")
    .select("*", { count: "exact" });

  if (programCountError) {
    console.error("Error fetching program count:", programCountError);
    throw new Error(programCountError.message);
  }

  // Get total projects
  const { data: projectCount, error: projectCountError } = await supabase
    .from("projects")
    .select("*", { count: "exact" });

  if (projectCountError) {
    console.error("Error fetching project count:", projectCountError);
    throw new Error(projectCountError.message);
  }

  // Scheduled travel orders
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const todayStart = `${today}T00:00:00`;
  // Fetch future travel orders based on departure_date or return_date
  const { data: futureOrders, error: futureError } = await supabase
    .from("travel_order")
    .select(
      "*, user:user_profile!travel_order_user_id_fkey (fullname), projects (project_name)"
    )
    .or(`departure_date.gte.${todayStart},return_date.gte.${todayStart}`)
    .limit(10);

  if (futureError) {
    console.error("Error fetching future travel orders:", futureError);
    throw new Error("Failed fetching future travel orders");
  }

  // Get last 10 activity logs
  const { data: activityLogs, error: activityLogsError } = await supabase
    .from("activity_logs")
    .select("*, user:user_profile (fullname)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (activityLogsError) {
    console.error("Error fetching activity logs:", activityLogsError);
    throw new Error(activityLogsError.message);
  }

  return {
    totalUsers: userCount?.length || 0,
    totalPrograms: programCount?.length || 0,
    totalProjects: projectCount?.length || 0,
    recentActivityLogs: activityLogs || [],
    futureTravelOrders: futureOrders || [],
  };
}

export async function SelectTravelOrdersByDateAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
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
    console.error("Error fetching future travel orders:", futureError);
    throw new Error("Failed fetching future travel orders");
  }

  return futureOrders;
}
