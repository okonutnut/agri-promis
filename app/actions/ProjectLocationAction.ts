"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { ProjectType, FCAType, ProjectLocationType } from "../../components/types";
import { sendNotificationToAll } from "./NotificationAction";

// PROJECT ACTIONS
export async function InsertProjectLocationAction(values: ProjectLocationType) {
  const supabase = await createClient(cookies());
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
    "Created a Project",
    `${values.location} has been added to project ${data.projects.project_name}.`,
    data.id,
  );

  // Send Notification
  await sendNotificationToAll(`New project location created: ${data.projects.project_name}.`);

  return data;
}

export async function EndProjectLocationAction(projectLocationID: string) {
  const supabase = await createClient(cookies());

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


export default async function SelectProjectLocationDetailsByIDAction(projectLocationID: string) {
  const supabase = await createClient(cookies());
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