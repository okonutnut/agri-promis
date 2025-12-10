"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { ProjectType, ProjectLocationType } from "../../components/types";
import { sendNotificationToAll } from "./NotificationAction";

// PROJECT ACTIONS
export async function InsertProjectAction(values: ProjectType) {
  const supabase = await createClient(cookies());
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const { data, error } = await supabase
    .from("projects")
    .insert({
      ...values,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Created a Project",
    `Project ${values.project_name as string} has been created.`
  );

  // Send Notification
  await sendNotificationToAll(`New project created: ${values.project_name}.`);

  return data;
}

export async function SelectAllProjectsByProgramIDAction(programID: string) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_location (*)
    `
    )
    .eq("program_id", programID);

  if (error) throw error;

  return data as ProjectType[];
}

export async function SelectAllProjectsByUserIDAction(userID: string) {
  const supabase = await createClient(cookies());

  // Fetch assigned projects for the user
  const { data: assignedProjects, error: assignedError } = await supabase
    .from("assigned_projects")
    .select("project_id")
    .eq("user_id", userID);

  if (assignedError) {
    throw assignedError;
  }

  // Fetch project details for the assigned project IDs
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .in(
      "id",
      assignedProjects.map((project) => project.project_id)
    )
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data as ProjectType[];
}

export async function SelectProgramAndProjectDetailsByProjectIDAction(
  projectLocationID: string
) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_location!inner (*)
    `
    )
    .eq("project_location.id", projectLocationID)
    .single();

  if (error) throw error;

  // Get FCA info
  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("id, description")
    .in("id", data.project_location[0]?.fca_ids ?? []);

  if (fcaError) throw fcaError;

  return {
    ...data,
    fca: fcaData.length > 0 ? fcaData : null,
  };
}

export async function SelectProjectDetailsByIDAction(
  projectLocationID: string
) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      programs (*),
      user_profile:created_by (fullname)
    `
    )
    .eq("id", projectLocationID)
    .single();

  if (error) throw error;

  return data;
}

export async function SelectProjectDetailsByProjectLocationIDAction(
  projectLocationID: string
) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("project_location")
    .select(
      `
      *,
      projects (*, programs (*)),
      user_profile:created_by (fullname)
    `
    )
    .eq("id", projectLocationID)
    .single();

  if (error) throw error;

  return data;
}

export async function EditProjectAction(data: ProjectLocationType) {
  const supabase = await createClient(cookies());

  // Step 1: Get project_location details first
  const { data: projectLocation, error: plError } = await supabase
    .from("project_location")
    .select("project_id")
    .eq("id", data.id)
    .single();

  if (plError) throw plError;

  // Step 2: Get parent project info
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("project_name")
    .eq("id", projectLocation.project_id)
    .single();

  if (projectError) throw projectError;

  // Step 3: Update project_location
  const { error } = await supabase
    .from("project_location")
    .update({
      description: data.description,
      progress_indicator: data.progress_indicator,
      status: data.status,
      fca_ids: data.fca_ids,
      total_alloted_area: data.total_alloted_area,
    })
    .eq("id", data.id);

  if (error) throw error;

  // Step 4: Log activity
  await InsertActivityLogAction(
    "Updated Project",
    `Project ${project.project_name} details have been updated successfully.`,
    data.id
  );

  // Step 5: Notify all
  await sendNotificationToAll(
    `Project ${project.project_name} details have been updated successfully.`
  );

  return;
}

export async function DeleteProjectAction(projectLocationID: string) {
  const supabase = await createClient(cookies());

  // get project name for logs
  const { data: projectData, error: projectError } = await supabase
    .from("project_location")
    .select("id, description, fca_ids")
    .eq("id", projectLocationID)
    .single();

  if (projectError) throw projectError;
  const projectName = projectData?.description;

  // delete assigned projects first
  const { error: assignedErr } = await supabase
    .from("assigned_projects")
    .delete()
    .eq("project_location_id", projectLocationID);

  if (assignedErr) throw assignedErr;

  // now delete project
  const { error } = await supabase
    .from("project_location")
    .delete()
    .eq("id", projectLocationID);

  if (error) throw error;

  await InsertActivityLogAction(
    "Deleted a Project",
    `Project ${projectName} has been deleted.`
  );
  await sendNotificationToAll(`Project deleted: ${projectName}.`);

  return;
}
