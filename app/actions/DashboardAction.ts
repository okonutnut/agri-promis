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

export async function SelectTotalProjectsPerProgramAction() {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
  .from("programs")
  .select(`
    id,
    program_name,
    projects:projects(count)
  `);

  if (error) {
    throw error;
  }

  return data;
}

export async function SelectUserCountPerTypeAction() {
  const supabase = await createClient(cookies());

  // Fetch all users and group them by `role`
  const { data, error } = await supabase
    .from("user_profile")
    .select("role");

  if (error) {
    console.error("Error fetching user count per type:", error);
    return [];
  }

  // Guard for nullable data (Supabase returns `data` as type T[] | null)
  const rows = data ?? [];

  // Group and count users per role with explicit typing
  const roleCounts = rows.reduce<Record<string, number>>((acc, user: any) => {
    const role = String(user?.role ?? "Unknown");
    acc[role] = (acc[role] ?? 0) + 1;
    return acc;
  }, {});

  // Convert to chart-friendly array with explicit types
  const formattedData: { role: string; count: number }[] = Object.entries(roleCounts).map(
    ([role, count]) => ({ role, count })
  );

  return formattedData;
}

export async function SelectMonitoringReportsCountByDate(project_id: string) {
  const supabase = await createClient(cookies());

  // Get project start and end dates
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("start_date, end_date")
    .eq("id", project_id)
    .single();

  if (projectError) throw projectError;
  if (!project) return [];

  const { start_date, end_date } = project;

  // Get monitoring reports within project range
  const { data: reports, error: reportsError } = await supabase
    .from("monitoring")
    .select("id, created_at")
    .eq("project_id", project_id)
    .gte("created_at", start_date)
    .lte("created_at", end_date);

  if (reportsError) throw reportsError;

  // Generate date range
  const start = new Date(start_date);
  const end = new Date(end_date);
  const dateArray = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dateArray.push(new Date(d));
  }

  // Count per day
  const counts = dateArray.map((date) => {
    const dateString = date.toISOString().split("T")[0];
    const count = reports.filter(
      (r) => r.created_at.split("T")[0] === dateString
    ).length;
    return { date: dateString, reports: count };
  });

  return counts;
}