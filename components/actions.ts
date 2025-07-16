"use server";

import {
  FieldReportType,
  LocationType,
  ProgramType,
  ProjectType,
  UserProfile,
} from "@/components/types";
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

export async function EditProgramNameAction({
  program_id,
  program_name,
}: {
  program_id: string;
  program_name: string;
}) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .update({ program_name })
      .eq("id", program_id)
      .select()
      .single();

    if (error) {
      throw new Error("Failed to update program name. Please try again.");
    }
    return data as ProgramType;
  } catch (error) {
    console.error("Error updating program name:", error);
    throw new Error("Failed to update program name. Please try again.");
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
        status: 1,
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

export async function SelectProgramAndProjectDetailsByProjectIDAction(
  projectID: string
) {
  try {
    const supabase = await createClient(); // your server-side Supabase client
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        programs (
          id,
          program_name,
          description,
          agriculturist_id
        )
      `
      )
      .eq("id", projectID)
      .single();

    if (error) {
      console.error("Error fetching project details:", error);
      throw new Error(error.message);
    }

    return data as ProjectType & { programs: ProgramType };
  } catch (error) {
    console.error(
      "Error in selectProgramAndProjectDetailsByProjectIDAction:",
      error
    );
    throw new Error("Failed to fetch project details. Please try again.");
  }
}

export async function EditProjectNameAction({
  project_id,
  project_name,
}: {
  project_id: string;
  project_name: string;
}) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .update({ project_name })
      .eq("id", project_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating project name:", error);
      throw new Error("Failed to update project name. Please try again.");
    }
    return data as ProjectType;
  } catch (error) {
    console.error("Error updating project name:", error);
    throw new Error("Failed to update project name. Please try again.");
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

// FIELD REPORT ACTIONS
export async function SelectAllFieldReportsByProjectIDAction(
  projectID: string
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("field_reports")
      .select(`*, user_profile (fullname)`)
      .eq("project_id", projectID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching field reports:", error);
      throw new Error(error.message);
    }

    return data as FieldReportType[];
  } catch (error) {
    console.error("Error in SelectAllFieldReportsByProjectIDAction:", error);
    throw new Error("Failed to fetch field reports. Please try again.");
  }
}

export async function InsertFieldReportAction({
  image_file,
  location_name,
  date_time_captured,
  latitude,
  longitude,
  status_note,
}: FieldReportType) {
  try {
    const supabase = await createClient();

    // Upload the image file if provided
    let photo_url = null;
    if (image_file) {
      const { data, error } = await supabase.storage
        .from("field-reports")
        .upload(`images/${Date.now()}_${image_file.name}`, image_file);

      if (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image. Please try again.");
      }
      photo_url = `${process.env.NEXT_PUBLIC_STORAGE_URL}/${data.fullPath}`;
    }

    // Insert the field report into the database
    const { data, error } = await supabase
      .from("field_reports")
      .insert({
        project_id: "d579819a-8b04-44f1-b60f-641771a6ac8e",
        reporter_id: (await supabase.auth.getUser()).data.user?.id,
        photo_url,
        location_name,
        date_time_captured: date_time_captured,
        latitude,
        longitude,
        status_note,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting field report:", error);
      throw new Error("Failed to create field report. Please try again.");
    }

    return data as FieldReportType;
  } catch (error) {
    console.error("Error in InsertFieldReportAction:", error);
    throw new Error("Failed to create field report. Please try again.");
  }
}

// MEMBERS ACTIONS
export async function InsertMemberAction(data: UserProfile) {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: data.email as string,
      user_metadata: {
        name: data.fullname as string,
        role: data.role as string,
      },
    });

  if (authError) {
    console.error("Error creating user:", authError);
    throw new Error(`Failed to create user: ${authError.message}`);
  }

  const { error: userError } = await supabase.from("user_profile").insert({
    id: authData.user.id,
    fullname: data.fullname,
    role: data.role,
  });

  if (userError) {
    console.error("Error creating field technician:", userError);
    throw new Error(`Failed to create field technician: ${userError.message}`);
  }

  return;
}

export async function SelectAllMembersAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("user_profile").select("*");

  if (error) {
    console.error("Error fetching members:", error);
    throw new Error(`Failed to fetch members: ${error.message}`);
  }

  // Get user email from auth
  const userIds = data?.map((item) => item.id).filter(Boolean) || [];
  const { data: userData, error: emailError } =
    await supabase.auth.admin.listUsers();
  if (emailError) {
    console.error("Error fetching user emails:", emailError);
    throw new Error(`Failed to fetch user emails: ${emailError.message}`);
  }
  const emailMap = new Map(
    (userData?.users ?? [])
      .filter((user) => userIds.includes(user.id))
      .map((user) => [user.id, user.email])
  );

  const result = data?.map((item) => ({
    ...item,
    role: item.role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char: string) => char.toUpperCase()),
    email: emailMap.get(item.id) || "",
  }));

  return result as UserProfile[];
}
