"use server";

import { MonitoringReportType } from "@/components/types";
import { createClient } from "@/utils/supabase/server";

// DASHBOARD ACTIONS
export async function SelectDashboardItemsAction(projectLocationID: string) {
  const supabase = await createClient();

  const [{ data: MData, error: MError }, { data: PData, error: projectError }] =
    await Promise.all([
      supabase
        .from("monitoring")
        .select("*")
        .eq("project_location_id", projectLocationID),
      supabase
        .from("project_location")
        .select("progress_indicator")
        .eq("id", projectLocationID)
        .single(),
    ]);

  if (MError) throw MError;
  if (projectError) throw projectError;

  return {
    m: MData,
    pi: PData.progress_indicator,
  };
}

export async function SelectUserDashboardItemsAction() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw userError;
  }

  const userId = userData.user.id;

  const [
    { data: TData, error: TError },
    { data: MData, error: MError },
    { data: APData, error: APError },
    { data: ALData, error: ALError },
  ] = await Promise.all([
    supabase
      .from("travel_order")
      .select("*")
      .eq("user_id", userId)
      .gte("return_date", new Date().toISOString())
      .order("created_at", { ascending: false }),
    supabase.from("monitoring").select("*").eq("reporter_id", userId),
    supabase
      .from("assigned_fieldtechnicians")
      .select("*")
      .eq("user_id", userId),
    supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (TError) throw TError;
  if (MError) throw MError;
  if (APError) throw APError;
  if (ALError) throw ALError;

  return { ap: APData, m: MData, to: TData, al: ALData };
}

export async function SelectAdminDashboardItemsAction() {
  const supabase = await createClient();
  const nowDate = new Date().toISOString().split("T")[0]; // e.g. "2025-09-18"

  // Optimize: Run all independent queries in parallel for better performance
  const [
    { count: userCount },
    { count: programCount },
    { count: projectCount },
    { count: fcaCount },
    { data: futureTravelOrders, error: futureTravelOrdersError },
    { data: activityLogs },
  ] = await Promise.all([
    supabase.from("user_profile").select("*", { count: "exact", head: true }),
    supabase.from("programs").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("projects").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("farmers").select("*", { count: "exact", head: true }),
    supabase
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
      `,
      )
      .gte("date", nowDate)
      .order("date", { ascending: true })
      .limit(5),
    supabase
      .from("activity_logs")
      .select("*, user:user_profile (fullname)")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (futureTravelOrdersError) {
    console.error(
      "Error fetching future travel orders:",
      futureTravelOrdersError,
    );
  }

  return {
    totalUsers: userCount ?? 0,
    totalPrograms: programCount ?? 0,
    totalProjects: projectCount ?? 0,
    totalFCAs: fcaCount ?? 0,
    recentActivityLogs: activityLogs ?? [],
    futureTravelOrders: futureTravelOrders ?? [],
  };
}

export async function SelectTotalProjectsPerProgramAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("programs").select(`
    id,
    program_name,
    projects:projects(count)
  `);

  if (error) {
    throw error;
  }

  return data;
}

export async function SelectMonitoringReportsCountByDate(project_id: string) {
  const supabase = await createClient();

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
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1 … Saturday = 6 :contentReference[oaicite:0]{index=0}
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
      (r) => r.created_at.split("T")[0] === dateString,
    ).length;
    return { date: dateString, reports: count };
  });

  return counts;
}

export async function SelectTravelOrdersAnalyticsAction() {
  const supabase = await createClient();

  // Get all travel orders with user info
  const { data: travelOrders, error: travelOrdersError } = await supabase
    .from("travel_order")
    .select(
      `
      *,
      user:user_profile!travel_order_user_id_fkey (fullname),
      program:programs!travel_order_program_id_fkey (program_name)
    `,
    )
    .order("created_at", { ascending: false });

  if (travelOrdersError) {
    throw travelOrdersError;
  }

  // Optimize: Calculate all statistics in a single pass instead of multiple filter/reduce operations
  const now = new Date();
  let totalTravelOrders = 0;
  let activeTravelOrders = 0;
  let upcomingTravelOrders = 0;
  let completedTravelOrders = 0;
  const travelOrdersByProgram: Record<string, number> = {};
  const travelOrdersByMonth: Record<string, number> = {};

  travelOrders?.forEach((to: any) => {
    totalTravelOrders++;

    // Count active
    if (to.is_active === 1 || to.is_active === true) {
      activeTravelOrders++;
    }

    // Count upcoming
    if (to.departure_date && new Date(to.departure_date) > now) {
      upcomingTravelOrders++;
    }

    // Count completed
    if (to.return_date && new Date(to.return_date) < now) {
      completedTravelOrders++;
    }

    // Group by program
    const programName = to.program?.program_name || "Unassigned";
    travelOrdersByProgram[programName] =
      (travelOrdersByProgram[programName] || 0) + 1;

    // Group by month
    if (to.created_at) {
      const date = new Date(to.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      travelOrdersByMonth[monthKey] = (travelOrdersByMonth[monthKey] || 0) + 1;
    }
  });

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
  const supabase = await createClient();

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
  const inactiveFCAs =
    fcas?.filter((fca) => fca.active_status === 0).length || 0;

  // Calculate total members
  const totalMembers =
    fcas?.reduce((sum, fca) => sum + (fca.member_count || 0), 0) || 0;

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

  // Optimize: Create a map of FCA ID -> project count to avoid O(n*m) nested loops
  const fcaProjectCountMap = new Map<string, number>();

  projectLocations?.forEach((project) => {
    const ids = Array.isArray(project.fca_ids) ? project.fca_ids : [];
    ids.forEach((fcaId: string) => {
      fcaProjectCountMap.set(fcaId, (fcaProjectCountMap.get(fcaId) || 0) + 1);
    });
  });

  // Calculate projects per FCA using the pre-built map (O(n) instead of O(n*m))
  const projectsPerFCA =
    fcas?.map((fca) => ({
      fcaName: fca.description || "Unknown",
      projectCount: fcaProjectCountMap.get(fca.id!) || 0,
    })) || [];

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

export async function SelectProjectDashboardItemsAction(projectID: string) {
  const supabase = await createClient();

  // Get Project Locations
  const {
    data: projectLocations,
    error: projectLocationsError,
    count: projectLocationsCount,
  } = await supabase
    .from("project_location")
    .select("*", { count: "exact" })
    .eq("project_id", projectID);
  if (projectLocationsError) throw projectLocationsError;

  // Get Monitoring Reports
  const {
    data: monitoringReports,
    error: monitoringReportsError,
    count: monitoringReportsCount,
  } = await supabase
    .from("monitoring")
    .select(
      "*, travel_order(travel_order_no), user_profile!monitoring_reporter_id_fkey(fullname)",
      { count: "exact" },
    )
    .in("project_location_id", projectLocations?.map((pl) => pl.id) || []);
  if (monitoringReportsError) throw monitoringReportsError;

  // Get unreviewed monitoring reports
  const unreviewedMonitoringReports =
    monitoringReports
      ?.filter((report: MonitoringReportType) => report.reviewed_by_id === null)
      .map((report) => ({
        id: report.id,
        project_location_id: report.project_location_id,
        travel_order_no: report.travel_order?.travel_order_no || "N/A",
        fullname: report.user_profile?.fullname || "Unknown",
        purpose: report.purpose || "No purpose provided",
        created_at: report.created_at || "Unknown date",
      })) || [];

  // Get FCA Count
  const fcaIds =
    projectLocations
      ?.flatMap((pl) => (Array.isArray(pl.fca_ids) ? pl.fca_ids : []))
      .filter((id): id is string => typeof id === "string") || [];

  return {
    projectLocationsCount: projectLocationsCount || 0,
    monitoringReportsCount: monitoringReportsCount || 0,
    fcaCount: fcaIds.length,
    unreviewedMonitoringReports,
  };
}
