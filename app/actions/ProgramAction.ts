"use server";

import { createClient } from "@/utils/supabase/server";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { ProgramType, UserProfileType } from "../../components/types";
import { sendNotificationToAll } from "./NotificationAction";

// PROGRAM ACTIONS
export async function InsertProgramAction({
  program_name,
  description,
}: ProgramType) {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data, error } = await supabase
    .from("programs")
    .insert({
      admin_id: userId,
      program_name: program_name,
      description: description,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Created a Program",
    `Program ${program_name as string} has been created.`,
  );

  // Send Notification
  await sendNotificationToAll(
    `New program created: ${program_name as string}.`,
  );

  return data;
}

export async function EditProgramNameAction({
  id,
  program_name,
  description,
  deleted_at,
}: ProgramType) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programs")
    .update({ program_name, description, deleted_at })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated Program Details",
    `Program ${data.program_name} details updated.`,
  );

  // Send Notification
  await sendNotificationToAll(`Program ${data.program_name} has been updated.`);

  return;
}

export async function SelectProgramByIdAction(programId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("id", programId)
    .single();

  if (error) {
    throw error;
  }

  return data as ProgramType;
}

export async function SelectAllProgramsByAgriculturistAction() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) throw userError;

  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      *,
      project_count:projects(count)
    `,
    )
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data as ProgramType[];
}

export async function SelectAllProgramsByUserIDAction(userID: string) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    throw userError;
  }

  const { data, error } = await supabase
    .from("programs")
    .select("*, project_count:projects(count)")
    .eq("admin_id", userID)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data as ProgramType[];
}

export async function DeleteProgramAction(programID: string) {
  const supabase = await createClient();

  // Get program details for logging
  const { data: programData, error: programError } = await supabase
    .from("programs")
    .select("program_name")
    .eq("id", programID)
    .single();

  if (programError) {
    throw programError;
  }

  const programName = programData?.program_name;

  // Delete the program
  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", programID);

  if (error) {
    throw error;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Deleted a Program",
    `Program ${programName} has been deleted.`,
  );

  // Send Notification
  await sendNotificationToAll(`Program deleted: ${programName}.`);

  return;
}

export async function SelectAllProgramsAction() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      *,
      project_count:projects(count),
      projects(*),
      user_profile:admin_id(fullname)
    `,
    )
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function SelectUserByProgramAssignedAction(programId?: string) {
  if (programId === "all") return [];

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    throw userError;
  }

  if (!programId) return [];

  const { data, error } = await supabase
    .from("assigned_projects")
    .select("user:user_profile(*), projects!inner(*)") // use inner join here
    .eq("projects.program_id", programId);

  if (error) {
    return [];
  }

  // filter out null projects (shouldn’t happen if you use !inner)
  const validRows = data.filter((item) => item.projects !== null);

  if (validRows.length === 0) return [];

  const users = validRows.map(
    (item) => item.user,
  ) as unknown as UserProfileType[];
  return users;
}

export async function SelectAllProgramsWithProjectsAction() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      *,
      projects (
        *,
        project_location (*)
      )
    `,
    )
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
}

export async function SelectProgramDashboardDataAction(programId: string) {
  const supabase = await createClient();

  try {
    // Fetch program with projects and locations in one query
    const { data: programData, error: programError } = await supabase
      .from("programs")
      .select(`
        *,
        projects (
          *,
          project_location (*)
        )
      `)
      .eq("id", programId)
      .single();

    if (programError) {
      throw programError;
    }

    // Fetch related travel orders
    const { data: travelOrders, error: travelError } = await supabase
      .from("travel_order")
      .select(`
        *,
        user:user_profile!travel_order_user_id_fkey(fullname),
        created_by:user_profile!travel_order_created_by_fkey(fullname),
        travel_itinerary:travel_order_itinerary_items(*)
      `)
      .eq("program_id", programId)
      .order("created_at", { ascending: false });

    if (travelError) {
      throw travelError;
    }

    // Fetch related post travel reports
    const { data: postTravelReports, error: postTravelError } = await supabase
      .from("post_travel_with_order")
      .select(`*`)
      .eq("program_id", programId)
      .order("created_at", { ascending: false });

    if (postTravelError) {
      throw postTravelError;
    }

    // Fetch related monitoring reports
    let monitoringReports = [];
    if (programData.projects && programData.projects.length > 0) {
      const projectIds = programData.projects.map((p: any) => p.id);

      if (projectIds.length > 0) {
        // Get project locations for these projects
        const { data: projectLocations, error: locError } = await supabase
          .from("project_location")
          .select("id")
          .in("project_id", projectIds);

        if (locError) {
          throw locError;
        }

        const projectLocationIds = projectLocations?.map((loc: any) => loc.id) || [];

        if (projectLocationIds.length > 0) {
          const { data: monitoringData, error: monitoringError } = await supabase
            .from("monitoring")
            .select(`
              *,
              project_location:project_location(*, projects(*)),
              travel_order:travel_order(travel_order_no, travel_itinerary:travel_order_itinerary_items(*)),
              reporter:user_profile!monitoring_reporter_id_fkey(fullname),
              reviewedBy:user_profile!monitoring_reviewed_by_id_fkey(fullname)
            `)
            .in("project_location_id", projectLocationIds)
            .order("created_at", { ascending: false });

          if (monitoringError) {
            throw monitoringError;
          }

          monitoringReports = monitoringData || [];
        }
      }
    }

    return {
      program: programData,
      projects: programData.projects || [],
      travelOrders: travelOrders || [],
      postTravelReports: postTravelReports || [],
      monitoringReports: monitoringReports
    };
  } catch (error) {
    console.error("Error fetching program dashboard data:", error);
    throw error;
  }
}
