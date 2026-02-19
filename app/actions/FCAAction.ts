"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { FCAType } from "../../components/types";
import { InsertActivityLogAction } from "./ActivityLogAction";
import { sendNotificationToAll } from "./NotificationAction";

// FCA ACTIONS
export async function InsertFCAAction(data: FCAType) {
  const supabase = await createClient(cookies());
  const { id, ...rest } = data;
  const { error } = await supabase
    .from("farmers")
    .insert({ ...rest, active_status: 1 });

  if (error) throw error;

  // Log activity
  await InsertActivityLogAction(
    "Inserted new FCA record",
    `Inserted FCA: ${data.description}`,
  );

  // Send Notification
  await sendNotificationToAll(`New FCA added: ${data.description as string}`);

  return;
}

export async function SelectAllFCAAction() {
  const supabase = await createClient(cookies());

  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("*");

  if (fcaError) throw fcaError;

  // Fetch ALL projects (do not filter here)
  const { data: projectData, error: projectError } = await supabase
    .from("project_location")
    .select("*, projects (project_name)");

  if (projectError) throw projectError;

  // Optimize: Create a map of FCA ID -> projects to avoid O(n*m) nested loops
  const fcaProjectsMap = new Map<string, typeof projectData>();

  projectData?.forEach((project) => {
    const ids = Array.isArray(project.fca_ids) ? project.fca_ids : [];
    ids.forEach((fcaId: string) => {
      if (!fcaProjectsMap.has(fcaId)) {
        fcaProjectsMap.set(fcaId, []);
      }
      fcaProjectsMap.get(fcaId)!.push(project);
    });
  });

  // Map projects to each FCA using the pre-built map (O(n) instead of O(n*m))
  const result = fcaData.map((fca) => ({
    ...fca,
    assignedProjects: fcaProjectsMap.get(fca.id!) || [],
  }));

  return result;
}

export async function SelectAllFCAByStatusAction(status: number) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("farmers")
    .select("*")
    .eq("active_status", status);

  if (error) {
    throw error;
  }

  return data as FCAType[];
}

export async function EditFCAAction(data: FCAType) {
  const supabase = await createClient(cookies());
  const { error } = await supabase
    .from("farmers")
    .update(data)
    .eq("id", data.id);

  if (error) {
    throw error;
  }

  // Log activity
  await InsertActivityLogAction(
    "Updated FCA record",
    `Updated FCA: ${data.description}`,
  );

  // Send Notification
  await sendNotificationToAll(`Updated FCA: ${data.description as string}`);

  return;
}

export async function EditFCAActiveStatusAction(fcaID: string, status: number) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("farmers")
    .update({ active_status: status })
    .eq("id", fcaID)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Log activity
  await InsertActivityLogAction(
    "Updated FCA record",
    `Update ${data.description}'s active status to ${
      status == 0 ? "Inactive" : "Active"
    }`,
  );

  // Send Notification
  try {
    await sendNotificationToAll(
      `Update ${data.description}'s active status to ${
        status == 0 ? "Inactive" : "Active"
      }`,
    );
  } catch (notificationError) {
    console.error(
      "Failed to send FCA status update notification",
      notificationError,
    );
  }

  return;
}

export async function SelectAllAssignedProjectsByFCAIDAction(fcaID: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("project_location")
    .select("projects (project_name), created_at")
    .contains("fca_ids", [fcaID]);

  if (error) {
    throw error;
  }

  return data;
}
