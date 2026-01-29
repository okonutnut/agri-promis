"use server";

import { SelectUserProfileByIDAction } from "@/app/actions/UserProfileAction";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { AssignedProjectsType } from "../../components/types";
import { sendNotificationToUser } from "./NotificationAction";

// ASSIGNED PROGRAM ACTIONS
export async function InsertFieldTechniciansToProgramAction(
  technicianIDs: string[],
  programID: string
) {
  const supabase = await createClient(cookies());

  // Validate inputs
  if (!programID || !technicianIDs || technicianIDs.length === 0) {
    throw new Error("Invalid program ID or technician IDs provided");
  }

  // Get program & program name
  const { data: programData, error: programError } = await supabase
    .from("programs")
    .select("program_name")
    .eq("id", programID)
    .single();

  if (programError) {
    throw new Error(`Failed to fetch program: ${programError.message}`);
  }

  if (!programData) {
    throw new Error("Program not found");
  }

  const programName = programData?.program_name ?? "Program";

  // Fetch existing assignments to avoid duplicates
  const { data: existing, error: existError } = await supabase
    .from("assigned_fieldtechnicians")
    .select("user_id")
    .eq("program_id", programID);

  if (existError) {
    throw new Error(`Failed to check existing assignments: ${existError.message}`);
  }

  const existingIDs = new Set(existing?.map((row) => row.user_id));

  const newAssignees = technicianIDs.filter((id) => !existingIDs.has(id));

  if (newAssignees.length === 0) {
    return { success: true, assigned: 0, message: "All selected technicians are already assigned to this program" };
  }

  // Insert all new assignees
  const insertPayload = newAssignees.map((id) => ({
    user_id: id,
    program_id: programID,
  }));

  const { error: insertError } = await supabase
    .from("assigned_fieldtechnicians")
    .insert(insertPayload);

  if (insertError) {
    throw new Error(`Failed to assign field technicians: ${insertError.message}`);
  }

  // Log and notify each new technician
  for (const technicianID of newAssignees) {
    const userProfile = await SelectUserProfileByIDAction(technicianID);

    await InsertActivityLogAction(
      "Assigned Field Technician",
      `Field technician ${userProfile?.fullname} assigned to ${programName}.`,
      undefined
    );

    await sendNotificationToUser(
      `You have been assigned to the program: ${programName}.`,
      technicianID
    );
  }

  return { success: true, assigned: newAssignees.length };
}

export async function DeleteFieldTechnicianFromProgramAction(
  user_id: string,
  program_id: string
) {
  const supabase = await createClient(cookies());

  // Delete the specific assignment
  const { error: deleteError } = await supabase
    .from("assigned_fieldtechnicians")
    .delete()
    .eq("user_id", user_id)
    .eq("program_id", program_id);

  if (deleteError) {
    throw deleteError;
  }

  // Get program details for logging
  const { data: programData, error: programError } = await supabase
    .from("programs")
    .select("program_name")
    .eq("id", program_id)
    .single();

  if (programError) {
    throw programError;
  }

  const existingUserData = await SelectUserProfileByIDAction(user_id);

  // Log the activity
  await InsertActivityLogAction(
    "Removed a Field Technician from Program",
    `Field technician ${existingUserData.fullname} was removed from program ${programData.program_name}.`,
    undefined
  );

  // Send Notification
  await sendNotificationToUser(
    `You have been removed from the program: ${programData.program_name}.`,
    user_id
  );

  return;
}

export async function SelectAllFieldTechniciansByProgramIDAction(
  programID: string
) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("assigned_fieldtechnicians")
    .select("*, programs (*), user_profile (fullname, position)")
    .eq("program_id", programID)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data as AssignedProjectsType[];
}

export async function CheckUserAssignedToProgramByProjectLocationAction(
  projectLocationID: string
) {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw userError;
  }

  // Get program_id from project_location -> projects -> program_id
  const { data: projectLocation, error: plError } = await supabase
    .from("project_location")
    .select("project_id, projects(program_id)")
    .eq("id", projectLocationID)
    .single();

  if (plError) throw plError;

  // Handle both array and single object responses
  const projects = (projectLocation as any)?.projects;
  const programID = Array.isArray(projects) 
    ? projects[0]?.program_id 
    : projects?.program_id;

  if (!programID) {
    return false;
  }

  // Check if user is assigned to this program
  const { data: assignment, error: assignError } = await supabase
    .from("assigned_fieldtechnicians")
    .select("id")
    .eq("user_id", userData.user.id)
    .eq("program_id", programID)
    .single();

  if (assignError && assignError.code !== "PGRST116") {
    // PGRST116 is "no rows returned" which is expected if not assigned
    throw assignError;
  }

  return !!assignment;
}

export async function SelectAllProgramsAssignedToCurrentUserAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw userError;
  }

  // Get all programs assigned to this user
  const { data: assignments, error: assignError } = await supabase
    .from("assigned_fieldtechnicians")
    .select("program_id, programs(*, project_count:projects(count))")
    .eq("user_id", userData.user.id);

  if (assignError) {
    throw assignError;
  }

  // Extract programs from assignments
  const programs = assignments
    .map((assignment: any) => assignment.programs)
    .filter((program: any) => program !== null);

  return programs;
}

