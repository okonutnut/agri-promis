"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { ProgramType } from "../../components/types";

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
    throw new Error("Failed to create program. Please try again.");
  }

  // Log the activity
  await InsertActivityLogAction(
    "Created a Program",
    `Program ${program_name as string} has been created.`
  );

  return data as ProgramType;
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
    console.error("Error fetching current program details:", currentError);
    throw new Error(
      "Failed to fetch current program details. Please try again."
    );
  }

  // Update the program name
  const { data, error } = await supabase
    .from("programs")
    .update({ program_name })
    .eq("id", program_id)
    .select()
    .single();

  if (error) {
    throw new Error("Failed to update program name. Please try again.");
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated Program Name",
    `Program ${currentProgram.program_name} name updated to ${program_name}.`
  );

  return data as ProgramType;
}

export async function SelectProgramByIdAction(programId: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("id", programId)
    .single();

  if (error) {
    console.error("Error fetching program:", error);
    throw new Error(error.message);
  }

  return data as ProgramType;
}

export async function SelectAllProgramsByAgriculturistAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const { data, error } = await supabase
    .from("programs")
    .select("*, project_count:projects(count)")
    .eq("admin_id", userData.user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching programs:", error);
    throw new Error(error.message);
  }

  return data as ProgramType[];
}

export async function SelectAllProgramsByUserIDAction(userID: string) {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const { data, error } = await supabase
    .from("programs")
    .select("*, project_count:projects(count)")
    .eq("admin_id", userID)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching programs:", error);
    throw new Error(error.message);
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
    console.error("Error fetching program details:", programError);
    throw new Error("Failed to fetch program details. Please try again.");
  }

  // Delete the program
  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", programID);

  if (error) {
    console.error("Error deleting program:", error);
    throw new Error(error.code);
  }

  // Log the activity
  await InsertActivityLogAction(
    "Deleted a Program",
    `Program ${programData.program_name} has been deleted.`
  );

  return;
}
