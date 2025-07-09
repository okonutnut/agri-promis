"use server";

import { createClient } from "@/utils/supabase/server";
import { CreateProgramFormData } from "./types";

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
  const { data, error } = await supabase.from("programs").insert({
    agriculturist_id: userId,
    program_name: program_name,
    description: description,
  });

  if (error) {
    throw new Error("Failed to create program. Please try again.");
  }

  return { success: true, message: "Program created successfully." };
}
