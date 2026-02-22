"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { AssignedProjectsType } from "../../components/types";
import { sendNotificationToUser } from "./NotificationAction";

// ASSIGNED PROJECTS ACTIONS
export async function InsertFieldTechniciansToProjectAction(
  technicianIDs: string[],
  projectLocationID: string,
) {
  const supabase = await createClient(cookies());

  // Get project & project name
  const { data: projectLoc, error: locError } = await supabase
    .from("project_location")
    .select("project_id, projects(project_name)")
    .eq("id", projectLocationID)
    .single();

  if (locError) throw locError;

  const projectName = projectLoc?.projects?.[0]?.project_name ?? "Project";

  // Fetch existing assignments to avoid duplicates
  const { data: existing, error: existError } = await supabase
    .from("assigned_projects")
    .select("user_id")
    .eq("project_location_id", projectLocationID);

  if (existError) throw existError;

  const existingIDs = new Set(existing?.map((row) => row.user_id));

  const newAssignees = technicianIDs.filter((id) => !existingIDs.has(id));

  if (newAssignees.length === 0) return;

  // Insert all new assignees
  const insertPayload = newAssignees.map((id) => ({
    user_id: id,
    project_location_id: projectLocationID,
  }));

  const { error: insertError } = await supabase
    .from("assigned_projects")
    .insert(insertPayload);

  if (insertError) throw insertError;

  // Batch fetch all user profiles to avoid N+1 queries
  const { data: userProfiles, error: userProfilesError } = await supabase
    .from("user_profile")
    .select("id, fullname")
    .in("id", newAssignees);

  if (userProfilesError) throw userProfilesError;

  const userProfileMap = new Map(
    (userProfiles || []).map((user) => [user.id, user]),
  );

  // Log and notify each new technician (using batched data)
  await Promise.all(
    newAssignees.map(async (technicianID) => {
      const userProfile = userProfileMap.get(technicianID);

      await InsertActivityLogAction(
        "Assigned Field Technician",
        `Field technician ${userProfile?.fullname || "Unknown"} assigned to ${projectName}.`,
        projectLocationID,
      );

      await sendNotificationToUser(
        `You have been assigned to the project: ${projectName}.`,
        technicianID,
      );
    }),
  );

  return { success: true, assigned: newAssignees.length };
}

export async function DeleteFieldTechnicianFromProjectAction(
  user_id: string,
  project_id: string,
) {
  const supabase = await createClient(cookies());

  // Delete the specific assignment
  const { error: deleteError } = await supabase
    .from("assigned_projects")
    .delete()
    .eq("user_id", user_id)
    .eq("project_location_id", project_id);

  if (deleteError) {
    throw deleteError;
  }

  // Get project details for logging
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("project_name, project_location!inner(*)")
    .eq("project_location.id", project_id)
    .single();

  if (projectError) {
    throw projectError;
  }

  // Fix N+1: Fetch user profile directly instead of calling separate action
  const { data: existingUserData, error: userError } = await supabase
    .from("user_profile")
    .select("fullname")
    .eq("id", user_id)
    .single();

  if (userError) {
    throw userError;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Removed a Field Technician from Project",
    `Field technician ${existingUserData?.fullname || "Unknown"} was removed from project ${projectData.project_name}.`,
    project_id,
  );

  // Send Notification
  await sendNotificationToUser(
    `You have been removed from the project: ${projectData.project_name}.`,
    user_id,
  );

  return;
}

export async function SelectAllFieldTechniciansByProjectIDAction(
  projectID: string,
) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("assigned_projects")
    .select("*, project_location (*), user_profile (fullname, position)")
    .eq("project_location_id", projectID)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data as AssignedProjectsType[];
}

export async function SelectAllAssignedProjectsByFieldTechnicianIDAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from("assigned_projects")
    .select(
      `
      id,
      user_id,
      project_location (
        *,
        projects (*)
      )
    `,
    )
    .eq("user_id", userData.user.id);

  if (error) throw error;

  return data.map((row: any) => ({
    ...row.project_location,
    project: row.project_location?.projects ?? null,
  }));
}
