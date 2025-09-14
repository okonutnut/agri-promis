"use server";
import { SelectUserProfileByIDAction } from "@/app/actions/UserProfileAction";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { AssignedProjectsType, ProjectType } from "../../components/types";
import { SendPushNotificationToUserAction } from "./SubscriptionAction";

// ASSIGNED PROJECTS ACTIONS
export async function InsertFieldTechniciansToProjectAction(
  data: string[],
  project_id: string
) {
  const supabase = await createClient(cookies());

  for (const technician_id of data) {
    // Check if the technician is already assigned to the project
    const { data: existingAssignment, error: selectError } = await supabase
      .from("assigned_projects")
      .select("*")
      .eq("user_id", technician_id)
      .eq("project_id", project_id)
      .maybeSingle();

    if (selectError) {
      throw selectError;
    }

    if (!existingAssignment) {
      // Insert new assignment if it doesn't exist
      const { error: insertError } = await supabase
        .from("assigned_projects")
        .insert({
          user_id: technician_id,
          project_id: project_id,
        });

      if (insertError) {
        throw insertError;
      }

      // Get project details for logging
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("project_name")
        .eq("id", project_id)
        .single();
      if (projectError) {
        throw projectError;
      }

      const userProfile = await SelectUserProfileByIDAction(technician_id);

      // Log the activity
      await InsertActivityLogAction(
        "Added a Field Technician to Project",
        `Field technician ${userProfile?.fullname} was added to project ${projectData.project_name}.`,
        project_id
      );

      // Send Notification
      for (const user_id of data) {
        await SendPushNotificationToUserAction(
          user_id,
          `You have been assigned to project ${projectData.project_name.toString()}.`
        );
      }
    }
  }

  return;
}

export async function DeleteFieldTechnicianFromProjectAction(
  user_id: string,
  project_id: string
) {
  const supabase = await createClient(cookies());

  // Delete the specific assignment
  const { error: deleteError } = await supabase
    .from("assigned_projects")
    .delete()
    .eq("user_id", user_id)
    .eq("project_id", project_id);

  if (deleteError) {
    throw deleteError;
  }

  // Get project details for logging
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("project_name")
    .eq("id", project_id)
    .single();
  if (projectError) {
    throw projectError;
  }

  const existingUserData = await SelectUserProfileByIDAction(user_id);

  // Log the activity
  await InsertActivityLogAction(
    "Removed a Field Technician from Project",
    `Field technician ${existingUserData.fullname} was removed from project ${projectData.project_name}.`,
    project_id
  );

  await SendPushNotificationToUserAction(
    user_id,
    `You have been removed from project ${projectData.project_name.toString()}.`
  );

  return;
}

export async function SelectAllFieldTechniciansByProjectIDAction(
  projectID: string
) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("assigned_projects")
    .select("*, user_profile (fullname, position)")
    .eq("project_id", projectID)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data as AssignedProjectsType[];
}

export async function SelectAllAssignedProjectsByFieldTechnicianIDAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const { data, error } = await supabase
    .from("assigned_projects")
    .select("project:projects!project_id(*)")
    .eq("user_id", userData.user.id);

  if (error) {
    throw error;
  }

  return data.map((item) => item.project) as ProjectType[];
}
