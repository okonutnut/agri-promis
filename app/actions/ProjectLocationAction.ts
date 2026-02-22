"use server";

import { createClient } from "@/utils/supabase/server";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { ProjectLocationType } from "../../components/types";
import { sendNotificationToAll } from "./NotificationAction";

// PROJECT ACTIONS
export async function InsertProjectLocationAction(values: ProjectLocationType) {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const { data, error } = await supabase
    .from("project_location")
    .insert({
      created_by: userId,
      progress_indicator: 1,
      status: 1,
      ...values,
    })
    .select("*, projects(project_name, program_id)")
    .single();

  if (error) {
    throw error;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Added a Project Location",
    `${values.location} has been added to project ${data.projects.project_name}.`,
    data.id,
  );

  // Send Notification
  await sendNotificationToAll(
    `New project location created: ${data.projects.project_name}.`,
  );

  return data;
}

export async function EndProjectLocationAction(projectLocationID: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_location")
    .update({
      status: 0, // Assuming 0 indicates 'ended' status
      end_date: new Date().toISOString(),
    })
    .eq("id", projectLocationID)
    .select("*, projects(project_name, program_id)")
    .single();

  if (error) {
    throw error;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Ended a Project",
    `Project ${data.projects.project_name}, ${data.location} has been ended.`,
    data.id,
  );

  // Send Notification
  await sendNotificationToAll(`Project has ended: ${data.location}.`);

  return data;
}

export default async function SelectProjectLocationDetailsByIDAction(
  projectLocationID: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_location")
    .select("*, projects(project_name, program_id)")
    .eq("id", projectLocationID)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function EditProjectLocationAction(data: ProjectLocationType) {
  const supabase = await createClient();

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
    data.id,
  );

  // Step 5: Notify all
  await sendNotificationToAll(
    `Project ${project.project_name} details have been updated successfully.`,
  );

  return;
}
