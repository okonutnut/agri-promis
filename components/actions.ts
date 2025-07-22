"use server";

import {
  AssignedProjectsType,
  LocationType,
  ProgramType,
  ProjectType,
  UserProfile,
  MonitoringReportType,
} from "@/components/types";
import { createClient } from "@/utils/supabase/server";

// USER PROFILE ACTIONS
export async function SelectUserProfileAction() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const { data: user } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", userData.user?.id)
    .single();

  if (!user) {
    console.error("User profile not found for ID:", userData.user.id);
    throw new Error("User profile not found");
  }

  return user.role as UserProfile;
}

// PROGRAM ACTIONS
export async function InsertProgramAction({
  program_name,
  description,
}: ProgramType) {
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
}

export async function EditProgramNameAction({
  program_id,
  program_name,
}: {
  program_id: string;
  program_name: string;
}) {
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
}

export async function SelectProgramByIdAction(programId: string) {
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
}

export async function SelectAllProgramsByAgriculturistAction() {
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
}

export async function DeleteProgramAction(programID: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", programID);

  if (error) {
    console.error("Error deleting program:", error);
    throw new Error(error.code);
  }
  return;
}

// PROJECT ACTIONS
export async function InsertProjectAction({
  program_id,
  project_name,
  crop_type,
  start_date,
  end_date,
}: ProjectType) {
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
}

export async function SelectAllProjectsByProgramIDAction(programID: string) {
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
}

export async function SelectProgramAndProjectDetailsByProjectIDAction(
  projectID: string
) {
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
}

export async function SelectProjectDetailsByProjectIDAction(projectID: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectID)
    .single();

  if (error) {
    console.error("Error fetching project details:", error);
    throw new Error(error.message);
  }

  return data as ProjectType;
}

export async function EditProjectNameAction({
  project_id,
  project_name,
}: {
  project_id: string;
  project_name: string;
}) {
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
}

// LOCATION HOOKS
export async function SelectLocationByIDAction(locationID: string) {
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
}

// MONITORING REPORT ACTIONS
export async function SelectAllMonitoringReportsByProjectIDAction(
  projectID: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("monitoring")
    .select(`*, user_profile (fullname)`)
    .eq("project_id", projectID)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching field reports:", error);
    throw new Error(error.message);
  }

  return data as MonitoringReportType[];
}

export async function InsertMonitoringReportAction({
  project_id,
  images,
  location_name,
  date_time_captured,
  latitude,
  longitude,
  status_note,
}: MonitoringReportType) {
  const supabase = await createClient();

  // Upload the image file if provided
  let photo_url: string[] = [];
  if (images && Array.isArray(images)) {
    for (const file of images) {
      if (file instanceof File) {
        const { data, error } = await supabase.storage
          .from("monitoring-reports")
          .upload(`images/${file.lastModified}_${file.name}`, file);

        if (error) {
          console.error("Error uploading image:", error);
          throw new Error("Failed to upload image. Please try again.");
        }
        photo_url.push(
          `${process.env.NEXT_PUBLIC_STORAGE_URL}/${data.fullPath}`
        );
      }
    }
  }

  // Insert the monitoring report into the database
  const { data, error } = await supabase
    .from("monitoring")
    .insert({
      project_id: project_id,
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

  return data as MonitoringReportType;
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

  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .order("role");

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

export async function SelectAllMembersByRoleAction(role: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("role", role);

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

// ASSIGNED PROJECTS ACTIONS
export async function InsertFieldTechnicianToProjectAction(
  data: AssignedProjectsType,
  project_id: string
) {
  const supabase = await createClient();

  // Try to fetch the assigned_projects row for the user
  const { data: existingUser, error: selectError } = await supabase
    .from("assigned_projects")
    .select("project_ids")
    .eq("user_id", data.user_id)
    .maybeSingle();

  if (selectError) {
    console.error("Error checking existing user:", selectError);
    throw new Error("Failed to check existing user. Please try again.");
  }

  if (existingUser) {
    // Avoid duplicate project_id
    const currentProjects: string[] = existingUser.project_ids || [];
    if (!currentProjects.includes(project_id)) {
      const updatedProjects = [...currentProjects, project_id];
      const { error: updateError } = await supabase
        .from("assigned_projects")
        .update({ project_ids: updatedProjects })
        .eq("user_id", data.user_id);

      if (updateError) {
        console.error("Error updating assigned projects:", updateError);
        throw new Error(
          "Failed to add project to field technician. Please try again."
        );
      }
    }
  } else {
    const { error: insertError } = await supabase
      .from("assigned_projects")
      .insert({
        ...data,
        project_ids: [project_id],
      });

    if (insertError) {
      console.error(
        "Error inserting field technician to project:",
        insertError
      );
      throw new Error(
        "Failed to add field technician to project. Please try again."
      );
    }
  }

  return;
}

export async function SelectAllFieldTechniciansByProjectIDAction(
  projectID: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assigned_projects")
    .select("*, user_profile (fullname)")
    .contains("project_ids", [projectID])
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching field technicians:", error);
    throw new Error(error.message);
  }

  return data as AssignedProjectsType[];
}

export async function SelectAllAssignedProjectsByFieldTechnicianIDAction() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assigned_projects")
    .select("*")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  if (error) {
    console.error("Error fetching assigned projects:", error);
    throw new Error(error.message);
  }

  const projectIds: string[] = data?.project_ids || [];
  if (projectIds.length === 0) {
    return [];
  }

  const { data: projectsData, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .in("id", projectIds);

  if (projectsError) {
    console.error("Error fetching projects:", projectsError);
    throw new Error(projectsError.message);
  }

  return projectsData as ProjectType[];
}
