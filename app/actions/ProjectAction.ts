"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { ProjectType, FCAType } from "../../components/types";
import { SendPushNotificationToAllAction } from "./SubscriptionAction";

// PROJECT ACTIONS

export async function InsertProjectAction(values: ProjectType) {
  const supabase = await createClient(cookies());
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // Auth check
  if (!userId) {
    throw new Error();
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      created_by: userId,
      progress_indicator: 1,
      status: 1,
      ...values,
    })
    .select()
    .single();

  if (error) {
    throw new Error();
  }

  // Log the activity
  await InsertActivityLogAction(
    "Created a Project",
    `Project ${values.project_name as string} has been created.`
  );

  // Send Notification
  await SendPushNotificationToAllAction(
    `A new project ${values.project_name as string} has been created.`
  );

  return data as ProjectType;
}

export async function SelectAllProjectsByProgramIDAction(programID: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("program_id", programID)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error();
  }

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
    throw new Error();
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
    throw new Error();
  }

  return data as ProjectType[];
}

export async function SelectProgramAndProjectDetailsByProjectIDAction(
  projectID: string
) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("projects")
    .select(`*,programs ("*")`)
    .eq("id", projectID)
    .single();

  if (error) {
    throw new Error();
  }

  // GET FCA Info
  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("id, description")
    .in("id", data.fca_ids);

  if (fcaError) {
    throw new Error();
  }

  const res = {
    ...data,
    fca: fcaData.length > 0 ? fcaData : null,
  };

  return res as ProjectType & { fca: FCAType[] | null };
}

export async function SelectProjectDetailsByProjectIDAction(projectID: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("projects")
    .select("*, programs (*)")
    .eq("id", projectID)
    .single();

  if (error) {
    throw new Error();
  }

  return data as ProjectType;
}

export async function EditProjectAction(data: ProjectType) {
  const supabase = await createClient(cookies());
  // Get the current project details for logging
  const { data: currentProject, error: currentError } = await supabase
    .from("projects")
    .select("project_name")
    .eq("id", data.id)
    .single();

  if (currentError) {
    throw new Error();
  }

  // Update the project name and status
  const { error } = await supabase
    .from("projects")
    .update({
      project_name: data.project_name,
      progress_indicator: data.progress_indicator,
      status: data.status,
      fca_ids: data.fca_ids,
    })
    .eq("id", data.id);

  if (error) {
    throw new Error();
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated Project",
    `Project ${currentProject.project_name} updated successfully.`
  );

  // Send Notification
  await SendPushNotificationToAllAction(
    `Project ${currentProject.project_name} has been updated.`
  );

  return;
}

export async function DeleteProjectAction(projectID: string) {
  const supabase = await createClient(cookies());

  // Get project details for logging
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("project_name")
    .eq("id", projectID)
    .single();

  if (projectError) {
    throw new Error();
  }

  const projectName = projectData?.project_name;

  // Delete the project
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectID);

  if (error) {
    throw new Error();
  }

  // Log the activity
  await InsertActivityLogAction(
    "Deleted a Project",
    `Project ${projectName} has been deleted.`
  );

  // Send Notification
  await SendPushNotificationToAllAction(
    `Project ${projectName} has been deleted.`
  );

  return;
}
