"use server";

import { createClient } from "@/utils/supabase/server";
import { CreateProgramFormData } from "../create-program/types";

export async function createProgramAction({
  program_name,
  description,
}: CreateProgramFormData) {
  const supabase = await createClient();
  // Validate inputs
  if (!program_name || !description) {
    throw new Error("Program name and description are required.");
  }

  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data, error } = await supabase
    .from("programs")
    .insert({
      agriculturist_id: userId,
      program_name: program_name,
      description: description,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Failed to create program. Please try again.");
  }

  return { success: true, data: data };
}

export async function fetchProgramsByAgriculturist() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const { data, error } = await supabase
    .from("programs")
    .select("program_name, id")
    .eq("agriculturist_id", userData.user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching programs:", error);
    throw new Error(error.message);
  }

  return { success: true, data };
}

export async function fetchProgramById(programId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("id", programId)
    .single();

  if (error) {
    console.error("Error fetching program:", error);
    throw new Error(error.message);
  }

  return { success: true, data };
}
