"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { ProgramType, UserProfileType } from "../../components/types";

// PROGRAM ACTIONS
export async function InsertProgramAction({
  program_name,
  description,
}: ProgramType) {
  const supabase = await createClient(cookies());
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
    `Program ${program_name as string} has been created.`
  );

  return data;
}

export async function EditProgramNameAction({
  program_id,
  program_name,
}: {
  program_id: string;
  program_name: string;
}) {
  const supabase = await createClient(cookies());
  // Get the current program details for logging
  const { data: currentProgram, error: currentError } = await supabase
    .from("programs")
    .select("program_name")
    .eq("id", program_id)
    .single();

  if (currentError) {
    throw currentError;
  }

  // Update the program name
  const { error } = await supabase
    .from("programs")
    .update({ program_name })
    .eq("id", program_id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated Program Name",
    `Program ${currentProgram.program_name} name updated to ${program_name}.`
  );

  return;
}

export async function SelectProgramByIdAction(programId: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("programs")
    .select("*, user_profile (fullname)")
    .eq("id", programId)
    .single();

  if (error) {
    throw error;
  }

  return data as ProgramType;
}

export async function SelectAllProgramsByAgriculturistAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    throw userError;
  }

  const { data, error } = await supabase
    .from("programs")
    .select("*, project_count:projects(count)")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data as ProgramType[];
}

export async function SelectAllProgramsByUserIDAction(userID: string) {
  const supabase = await createClient(cookies());
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
  const supabase = await createClient(cookies());

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
    `Program ${programName} has been deleted.`
  );

  return;
}

export async function SelectAllProgramsAction() {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      *,
      project_count:projects(count),
      projects(*),
      user_profile:admin_id(fullname)
    `
    )
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function SelectUserByProgramAssignedAction(programId?: string) {
  if (programId === "all") return [];

  const supabase = await createClient(cookies());
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
    (item) => item.user
  ) as unknown as UserProfileType[];
  return users;
}
