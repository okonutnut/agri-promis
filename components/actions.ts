"use server";

import { LocationType, ProgramType, ProjectType } from "@/components/types";
import { createClient } from "@/utils/supabase/server";

// PROGRAM ACTIONS
export async function InsertProgramAction({
  program_name,
  description,
}: ProgramType) {
  try {
    const supabase = await createClient();
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
    return data as ProgramType;
  } catch (error) {
    console.error("Error inserting program:", error);
    throw new Error("Failed to create program. Please try again.");
  }
}

export async function SelectProgramByIdAction(programId: string) {
  try {
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

    return data as ProgramType;
  } catch (error) {
    console.error("Error in SelectProgramByIdAction:", error);
    throw new Error("Failed to fetch program. Please try again.");
  }
}

export async function SelectAllProgramsByAgriculturistAction() {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user?.id) {
      console.error("Error fetching user:", userError);
      throw new Error(userError?.message || "User not authenticated");
    }

    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("agriculturist_id", userData.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching programs:", error);
      throw new Error(error.message);
    }

    return data as ProgramType[];
  } catch (error) {
    console.error("Error in SelectAllProgramsByAgriculturistAction:", error);
    throw new Error("Failed to fetch programs. Please try again.");
  }
}

// PROJECT ACTIONS
export async function InsertProjectAction({
  program_id,
  project_name,
  crop_type,
  start_date,
  end_date,
  location_id,
}: ProjectType) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { data, error } = await supabase
      .from("projects")
      .insert({
        project_name: project_name,
        crop_type: crop_type,
        start_date: new Date(start_date).toISOString(),
        end_date: new Date(end_date).toISOString(),
        location_id: "862975a3-54ad-495d-8e94-7997af554315",
        created_by: userId,
        program_id: program_id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting project:", error);
      throw new Error(`Failed to create project. ${error.message}`);
    }

    return data as ProjectType;
  } catch (error) {
    console.error("Error inserting project:", error);
    throw new Error("Failed to create project. Please try again.");
  }
}

export async function SelectAllProjectsByProgramIDAction(programID: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("program_id", programID)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching projects:", error);
      throw new Error(error.message);
    }

    return data as ProjectType[];
  } catch (error) {
    console.error("Error in SelectAllProjectsByProgramID:", error);
    throw new Error("Failed to fetch projects. Please try again.");
  }
}

// LOCATION HOOKS
export async function SelectLocationByIDAction(locationID: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("id", locationID)
      .single();

    if (error) {
      console.error("Error fetching location:", error);
      throw new Error(error.message);
    }

    return data as LocationType;
  } catch (error) {
    console.error("Error in SelectLocationByLocationIDAction:", error);
    throw new Error("Failed to fetch location. Please try again.");
  }
}
