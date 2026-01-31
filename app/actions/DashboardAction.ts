"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// DASHBOARD ACTIONS
export async function SelectDashboardItemsAction(projectLocationID: string) {
  const supabase = await createClient(cookies());

  // 1. total assigned ft
  const { data: APData, error: APError } = await supabase
    .from("assigned_projects")
    .select("*")
    .eq("project_location_id", projectLocationID);

  if (APError) throw APError;

  // 2. total monitoring reports
  const { data: MData, error: MError } = await supabase
    .from("monitoring")
    .select("*")
    .eq("project_location_id", projectLocationID);

  if (MError) throw MError;

  // 3. project progress indicator
  const { data: PData, error: projectError } = await supabase
    .from("project_location")
    .select("progress_indicator")
    .eq("id", projectLocationID)
    .single();

  if (projectError) throw projectError;

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
  
  const nowDate = new Date().toISOString().split("T")[0]; // e.g. "2025-09-18"
  
  const { count: userCount } = await supabase
    .from("user_profile")
    .select("*", { count: "exact", head: true });

  const { count: programCount } = await supabase
    .from("programs")
    .select("*", { count: "exact", head: true });

  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: fcaCount } = await supabase
    .from("farmers")
    .select("*", { count: "exact", head: true });

  const { data: futureTravelOrders, error: futureTravelOrdersError } = await supabase
    .from("travel_order_itinerary_items")
    .select(
      `
    *,
    travel_order!inner (
      travel_order_no,
      is_active,
      user:user_profile!travel_order_user_id_fkey (
        fullname
      )
    )
  `
    )
    .gte("date", nowDate)
    .order("date", { ascending: true })
    .limit(5);

  if (futureTravelOrdersError) {
    console.error("Error fetching future travel orders:", futureTravelOrdersError);
  }

  const { data: activityLogs } = await supabase
    .from("activity_logs")
    .select("*, user:user_profile (fullname)")
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    totalUsers: userCount ?? 0,
    totalPrograms: programCount ?? 0,
    totalProjects: projectCount ?? 0,
    totalFCAs: fcaCount ?? 0,
    recentActivityLogs: activityLogs ?? [],
    futureTravelOrders: futureTravelOrders ?? [],
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

  const { data: project, error: projectError } = await supabase
    .from("project_location")
    .select("start_date, end_date")
    .eq("id", project_id)
    .single();

  if (projectError) throw projectError;
  if (!project) return [];

  const start_date = project.start_date;

  let end_date: string;
  if (project.end_date) {
    end_date = project.end_date;
  } else {
    const today = new Date();
    const dayOfWeek = today.getDay();            // Sunday = 0, Monday = 1 … Saturday = 6 :contentReference[oaicite:0]{index=0}
    const daysUntilSunday = (7 - dayOfWeek) % 7; // if today is Sunday, this gives 0
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + daysUntilSunday);
    end_date = sunday.toISOString().split("T")[0];
  }

  const { data: reports, error: reportsError } = await supabase
    .from("monitoring")
    .select("id, created_at")
    .eq("project_location_id", project_id)
    .gte("created_at", start_date)
    .lte("created_at", end_date);

  if (reportsError) throw reportsError;

  const start = new Date(start_date);
  const end = new Date(end_date);
  const dateArray = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dateArray.push(new Date(d));
  }

  const counts = dateArray.map((date) => {
    const dateString = date.toISOString().split("T")[0];
    const count = reports.filter(
      (r) => r.created_at.split("T")[0] === dateString
    ).length;
    return { date: dateString, reports: count };
  });

  return counts;
}

export async function SelectTravelOrdersAnalyticsAction() {
  const supabase = await createClient(cookies());

  // Get all travel orders with user info
  const { data: travelOrders, error: travelOrdersError } = await supabase
    .from("travel_order")
    .select(
      `
      *,
      user:user_profile!travel_order_user_id_fkey (fullname),
      program:programs!travel_order_program_id_fkey (program_name)
    `
    )
    .order("created_at", { ascending: false });

  if (travelOrdersError) {
    throw travelOrdersError;
  }

  // Calculate statistics
  const now = new Date();
  const totalTravelOrders = travelOrders?.length || 0;
  const activeTravelOrders = travelOrders?.filter(
    (to) => to.is_active === 1 || to.is_active === true
  ).length || 0;
  
  const upcomingTravelOrders = travelOrders?.filter((to) => {
    if (!to.departure_date) return false;
    return new Date(to.departure_date) > now;
  }).length || 0;

  const completedTravelOrders = travelOrders?.filter((to) => {
    if (!to.return_date) return false;
    return new Date(to.return_date) < now;
  }).length || 0;

  // Group by program
  const travelOrdersByProgram = travelOrders?.reduce((acc: any, to: any) => {
    const programName = to.program?.program_name || "Unassigned";
    acc[programName] = (acc[programName] || 0) + 1;
    return acc;
  }, {}) || {};

  // Group by month
  const travelOrdersByMonth = travelOrders?.reduce((acc: any, to: any) => {
    if (!to.created_at) return acc;
    const date = new Date(to.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    acc[monthKey] = (acc[monthKey] || 0) + 1;
    return acc;
  }, {}) || {};

  return {
    totalTravelOrders,
    activeTravelOrders,
    upcomingTravelOrders,
    completedTravelOrders,
    travelOrdersByProgram,
    travelOrdersByMonth,
    recentTravelOrders: travelOrders?.slice(0, 10) || [],
  };
}

export async function SelectFCAAnalyticsAction() {
  const supabase = await createClient(cookies());

  // Get all FCAs
  const { data: fcas, error: fcaError } = await supabase
    .from("farmers")
    .select("*");

  if (fcaError) {
    throw fcaError;
  }

  // Get all project locations with FCA assignments
  const { data: projectLocations, error: projectError } = await supabase
    .from("project_location")
    .select("id, fca_ids, projects (project_name)");

  if (projectError) {
    throw projectError;
  }

  // Calculate statistics
  const totalFCAs = fcas?.length || 0;
  const activeFCAs = fcas?.filter((fca) => fca.active_status === 1).length || 0;
  const inactiveFCAs = fcas?.filter((fca) => fca.active_status === 0).length || 0;

  // Calculate total members
  const totalMembers = fcas?.reduce((sum, fca) => sum + (fca.member_count || 0), 0) || 0;

  // Calculate FCAs with projects
  const fcasWithProjects = new Set<string>();
  projectLocations?.forEach((project) => {
    if (Array.isArray(project.fca_ids)) {
      project.fca_ids.forEach((fcaId: string) => {
        fcasWithProjects.add(fcaId);
      });
    }
  });

  // Group FCAs by status
  const fcasByStatus = {
    active: activeFCAs,
    inactive: inactiveFCAs,
  };

  // Calculate projects per FCA
  const projectsPerFCA = fcas?.map((fca) => {
    const assignedProjects = projectLocations?.filter((project) => {
      if (!Array.isArray(project.fca_ids)) return false;
      return project.fca_ids.includes(fca.id!);
    }).length || 0;
    return {
      fcaName: fca.description || "Unknown",
      projectCount: assignedProjects,
    };
  }) || [];

  return {
    totalFCAs,
    activeFCAs,
    inactiveFCAs,
    totalMembers,
    fcasWithProjects: fcasWithProjects.size,
    fcasByStatus,
    projectsPerFCA,
    recentFCAs: fcas?.slice(0, 10) || [],
  };
}