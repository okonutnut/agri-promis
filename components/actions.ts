"use server";

import {
  AssignedProjectsType,
  ProgramType,
  ProjectType,
  UserProfileType,
  MonitoringReportType,
  TravelOrderType,
  ActivityLogType,
  FCAType,
} from "@/components/types";
import { decodeSupabaseJWT } from "@/utils/helpers/decodeSupabaseJwt";
import { createClient } from "@/utils/supabase/server";
import webpush from "web-push";
import type { PushSubscription as WebPushSubscription } from "web-push";
import { cookies } from "next/headers";
import { getLongtitudeLatitudeFromGPS } from "@/lib/utils";

// SUPABASE UTILS
export async function getSignedUrl(path: string) {
  const supabase = createClient(cookies());

  const { data, error } = await (await supabase).storage
    .from("monitoring-reports")
    .createSignedUrl(path, 60 * 60); // 1h expiration

  if (error) throw error;
  return data.signedUrl;
}

// USER PROFILE ACTIONS
export async function SelectAllUserProfilesAction() {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .order("fullname", { ascending: true });
  if (error) {
    console.error("Error fetching user profiles:", error);
    throw new Error(error.message);
  }
  return data as UserProfileType[];
}

export async function SelectUserProfileByIDAction(userID: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", userID)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    throw new Error(error.message);
  }

  return data as UserProfileType;
}

export async function SelectUserProfileAction() {
  const supabase = await createClient(cookies());
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

  return user as UserProfileType;
}

// FCA ACTIONS
export async function InsertFCAAction(data: FCAType) {
  const supabase = await createClient(cookies());
  const { id, ...rest } = data;
  const { error } = await supabase
    .from("farmers")
    .insert({ ...rest, active_status: 1 });

  if (error) {
    console.error("Error inserting FCA:", error);
    throw new Error(error.message);
  }

  return;
}

export async function SelectAllFCAAction() {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase.from("farmers").select("*");

  if (error) {
    console.error("Error fetching all FCA:", error);
    throw new Error(error.message);
  }

  return data as FCAType[];
}

export async function SelectAllFCAByStatusAction(status: number) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("farmers")
    .select("*")
    .eq("active_status", status);

  if (error) {
    console.error("Error fetching FCA by status:", error);
    throw new Error(error.message);
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
    console.error("Error updating FCA:", error);
    throw new Error(error.message);
  }

  return;
}

export async function SelectAllAssignedProjectsByFCAIDAction(fcaID: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("projects")
    .select("project_name, created_at")
    .contains("fca_ids", [fcaID]);

  if (error) {
    console.error("Error fetching assigned projects by FCA ID:", error);
    throw new Error(error.message);
  }

  return data;
}

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

// PROJECT ACTIONS
export async function InsertProjectAction(values: ProjectType) {
  const supabase = await createClient(cookies());
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // Auth check
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      created_by: userId,
      status: 1,
      ...values,
    })
    .select()
    .single();

  if (error) {
    console.error("Error inserting project:", error);
    throw new Error(`Failed to create project. ${error.message}`);
  }

  // Log the activity
  await InsertActivityLogAction(
    "Created a Project",
    `Project ${values.project_name as string} has been created.`
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
    console.error("Error fetching projects:", error);
    throw new Error(error.message);
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
    console.error("Error fetching assigned projects:", assignedError);
    throw new Error(assignedError.message);
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
    console.error("Error fetching projects:", error);
    throw new Error(error.message);
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
    console.error("Error fetching project details:", error);
    throw new Error(error.message);
  }

  // GET FCA Info
  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("id, description")
    .in("id", data.fca_ids);

  if (fcaError) {
    console.error("Error fetching FCA details:", fcaError);
    throw new Error(fcaError.message);
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
    .select("*")
    .eq("id", projectID)
    .single();

  if (error) {
    console.error("Error fetching project details:", error);
    throw new Error(error.message);
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
    console.error("Error fetching current project details:", currentError);
    throw new Error(
      "Failed to fetch current project details. Please try again."
    );
  }

  // Update the project name and status
  const { error } = await supabase
    .from("projects")
    .update({
      project_name: data.project_name,
      status: data.status,
      fca_ids: data.fca_ids,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating project name:", error);
    throw new Error("Failed to update project name. Please try again.");
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated Project",
    `Project ${currentProject.project_name} updated successfully.`
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
    console.error("Error fetching project details:", projectError);
    throw new Error("Failed to fetch project details. Please try again.");
  }

  const projectName = projectData?.project_name;

  // Delete the project
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectID);

  if (error) {
    console.error("Error deleting project:", error);
    throw new Error(error.code);
  }

  // Log the activity
  await InsertActivityLogAction(
    "Deleted a Project",
    `Project ${projectName} has been deleted.`
  );

  return;
}

// TRAVEL ORDER ACTIONS
export async function InsertTravelOrderAction(data: TravelOrderType) {
  const supabase = await createClient(cookies());
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const { error } = await supabase.from("travel_order").insert({
    ...data,
    is_active: 1,
    created_by: user?.id,
  });

  if (error) {
    console.error("Error inserting travel order:", error);
    throw new Error(`Failed to create travel order. ${error.message}`);
  }

  // Fetch user profile for logging
  const { data: userProfile, error: profileError } = await supabase
    .from("user_profile")
    .select("fullname")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
    throw new Error("Failed to fetch user profile. Please try again.");
  }

  // Log the activity
  await InsertActivityLogAction(
    "Created a Travel Order",
    `Travel order for ${userProfile.fullname} has been created.`
  );

  return;
}

export async function SelectAllTravelOrdersByUserIDAction(user_id?: string) {
  const supabase = await createClient(cookies());
  if (!user_id) {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error("Error fetching user:", userError);
      throw new Error(userError?.message || "User not authenticated");
    }

    user_id = userData.user.id;
  }

  const { data, error } = await supabase
    .from("travel_order")
    .select(
      `*, project:projects(id, project_name), user:user_profile!travel_order_user_id_fkey(fullname),
      created_by:user_profile!travel_order_created_by_fkey(fullname)`
    )
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching travel orders:", error);
    throw new Error(error.message);
  }

  return data as TravelOrderType[];
}

export async function SelectAllTravelOrdersByProgramIDAction(
  programID: string
) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("travel_order")
    .select(
      `*, project:projects(id, project_name), user:user_profile!travel_order_user_id_fkey(fullname),
      created_by:user_profile!travel_order_created_by_fkey(fullname)`
    )
    .eq("program_id", programID)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching travel orders:", error);
    throw new Error(error.message);
  }

  return data as TravelOrderType[];
}

// MONITORING REPORT ACTIONS
export async function SelectAllMonitoringReportsByProjectIDAction(
  projectID: string
) {
  const supabase = await createClient(cookies());

  // Step 1: Fetch monitoring reports with joins
  const { data, error } = await supabase
    .from("monitoring")
    .select(
      `*, 
      project:projects(project_name, location, fca_ids),
      travel_order:travel_order(travel_order_no, purpose),
      reporter:user_profile!monitoring_reporter_id_fkey(fullname),
      remarkBy:user_profile!monitoring_reviewed_by_id_fkey(fullname)`
    )
    .eq("project_id", projectID)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching field reports:", error);
    throw new Error(error.message);
  }

  // Step 2: Collect all FCA IDs from projects
  const projectFCAIds = Array.from(
    new Set(
      data
        .map((report) => report.project?.fca_ids || [])
        .flat()
        .filter((id): id is string => !!id)
    )
  );

  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("id, description")
    .in("id", projectFCAIds);

  if (fcaError) {
    console.error("Error fetching FCA details:", fcaError);
    throw new Error(fcaError.message);
  }

  // Step 3: Map FCA + convert photo paths -> signed URLs
  const reportsWithFCA = await Promise.all(
    data.map(async (report) => {
      // Convert photo paths to signed URLs
      const signedPhotoUrls = report.photo_url
        ? await Promise.all(
            report.photo_url.map(async (path: string) => {
              const { data: signed } = await supabase.storage
                .from("monitoring-reports")
                .createSignedUrl(path, 60 * 60); // 1h expiry
              return signed?.signedUrl ?? null;
            })
          )
        : [];

      // Attach FCA details
      const fcaDetails = report.project?.fca_ids
        ? fcaData.filter((fca) => report.project?.fca_ids.includes(fca.id))
        : [];

      return {
        ...report,
        photo_url: signedPhotoUrls.filter((url) => url !== null), // only valid URLs
        project: { ...report.project, fcaDetails },
      };
    })
  );

  return reportsWithFCA as MonitoringReportType[];
}

export async function SelectAllMonitoringReportsByProjectIDAndUserAction(
  projectID: string
) {
  const supabase = await createClient(cookies());

  // Get logged-in user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  // Fetch reports by this user for the project
  const { data, error } = await supabase
    .from("monitoring")
    .select(
      `*, 
      project:projects(project_name, fca_ids),
      travel_order:travel_order(travel_order_no, purpose),
      reporter:user_profile!monitoring_reporter_id_fkey(fullname),
      reviewedBy:user_profile!monitoring_reviewed_by_id_fkey(fullname)`
    )
    .eq("reporter_id", userData.user.id)
    .eq("project_id", projectID)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching monitoring reports:", error);
    throw new Error(error.message);
  }

  // Collect unique FCA IDs from all reports
  const projectFCAIds = Array.from(
    new Set(
      data
        .map((report) => report.project?.fca_ids || [])
        .flat()
        .filter((id): id is string => !!id)
    )
  );

  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("id, description")
    .in("id", projectFCAIds);

  if (fcaError) {
    console.error("Error fetching FCA details:", fcaError);
    throw new Error(fcaError.message);
  }

  // Map FCA details + signed URLs
  const reportsWithExtras = await Promise.all(
    data.map(async (report) => {
      // Resolve signed image URLs
      const signedPhotoUrls = report.photo_url
        ? await Promise.all(
            report.photo_url.map(async (path: string) => {
              const { data: signed } = await supabase.storage
                .from("monitoring-reports")
                .createSignedUrl(path, 60 * 60); // valid 1 hour
              return signed?.signedUrl ?? null;
            })
          )
        : [];

      // Attach FCA details
      const fcaDetails = report.project?.fca_ids
        ? fcaData.filter((fca) => report.project?.fca_ids.includes(fca.id))
        : [];

      return {
        ...report,
        photo_url: signedPhotoUrls.filter((url) => url !== null),
        project: { ...report.project, fcaDetails },
      };
    })
  );

  return reportsWithExtras as MonitoringReportType[];
}

export async function SelectAllMonitoringReportsByCurrentUserAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  // Fetch reports for this user
  const { data, error } = await supabase
    .from("monitoring")
    .select(
      `*, 
      project:projects(project_name, fca_ids),
      travel_order:travel_order(travel_order_no, purpose),
      reporter:user_profile!monitoring_reporter_id_fkey(fullname),
      reviewedBy:user_profile!monitoring_reviewed_by_id_fkey(fullname)`
    )
    .eq("reporter_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching monitoring reports:", error);
    throw new Error(error.message);
  }

  // Collect FCA IDs
  const projectFCAIds = Array.from(
    new Set(
      data
        .map((report) => report.project?.fca_ids || [])
        .flat()
        .filter((id): id is string => !!id)
    )
  );

  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("id, description")
    .in("id", projectFCAIds);

  if (fcaError) {
    console.error("Error fetching FCA details:", fcaError);
    throw new Error(fcaError.message);
  }

  // Resolve signed image URLs + map FCA details
  const reportsWithExtras = await Promise.all(
    data.map(async (report) => {
      const signedPhotoUrls = report.photo_url
        ? await Promise.all(
            report.photo_url.map(async (path: string) => {
              const { data: signed } = await supabase.storage
                .from("monitoring-reports")
                .createSignedUrl(path, 60 * 60);
              return signed?.signedUrl ?? null;
            })
          )
        : [];

      const fcaDetails = report.project?.fca_ids
        ? fcaData.filter((fca) => report.project?.fca_ids.includes(fca.id))
        : [];

      return {
        ...report,
        photo_url: signedPhotoUrls.filter((url) => url !== null),
        project: { ...report.project, fcaDetails },
      };
    })
  );

  // Sort by travel_order_no (your custom sort)
  const sortedReports = reportsWithExtras.sort((a, b) => {
    const travelOrderNoA = a.travel_order?.travel_order_no || "Unknown";
    const travelOrderNoB = b.travel_order?.travel_order_no || "Unknown";
    return travelOrderNoA.localeCompare(travelOrderNoB);
  });

  return sortedReports as MonitoringReportType[];
}

export async function InsertMonitoringReportAction({
  project_id,
  purpose,
  findings,
  observation,
  issues_concern,
  images,
  remarks,
  travel_order_no,
}: MonitoringReportType) {
  if (!images?.length) throw new Error("No images provided");

  const supabase = await createClient(cookies());

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Upload images to Supabase Storage
  const imageFile = images.map((img) => {
    return img.file;
  });

  const photo_paths = await Promise.all(
    imageFile.map(async (file) => {
      if (!(file instanceof File)) throw new Error("Invalid file");

      const filePath = `images/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("monitoring-reports")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      return filePath;
    })
  );

  // Upload Monitoring Report to Supabase Database
  const { error } = await supabase.from("monitoring").insert({
    travel_order_no,
    project_id,
    purpose,
    findings: findings?.filter((f) => f !== "") || [],
    issues_concern: issues_concern?.filter((i) => i !== "") || [],
    reporter_id: user.id,
    observation,
    photo_url: photo_paths,
    remarks,
  });

  if (error) throw error;

  // Get project name for logging
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select()
    .eq("id", project_id)
    .single();

  if (projectError) {
    console.error("Error fetching project data:", projectError);
    throw new Error("Failed to fetch project data. Please try again.");
  }

  // Log the activity
  await InsertActivityLogAction(
    "Submitted a Monitoring Report",
    `Monitoring report submitted for project ${projectData.project_name}.`,
    project_id
  );

  return;
}

export async function InsertRemarksInMonitoringReportAction(
  reportId: string,
  remarks: string
) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("monitoring")
    .update({
      remarks,
      reviewed_by_id: (await supabase.auth.getUser()).data.user?.id,
    })
    .eq("id", reportId)
    .select()
    .single();

  if (error) {
    console.error("Error inserting remarks:", error);
    throw new Error("Failed to insert remarks. Please try again.");
  }

  // Log the activity
  await InsertActivityLogAction(
    "Reviewed a Monitoring Report",
    `Monitoring report with ID ${reportId} has been reviewed.`,
    data.project_id
  );

  return;
}

// MEMBERS ACTIONS
export async function InsertMemberAction(data: UserProfileType) {
  const supabase = await createClient(cookies());

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: data.email as string,
      email_confirm: true,
      user_metadata: {
        name: data.fullname as string,
        active_status: 1,
        role: data.role,
      },
    });

  if (authError) {
    console.error("Error creating user:", authError);
    throw new Error(`Failed to create user: ${authError.message}`);
  }

  // Get the user ID from the auth data
  const userId = authData.user.id;

  const { error: userError } = await supabase.from("user_profile").insert({
    ...data,
    id: userId,
  });

  if (userError) {
    console.error("Error creating member:", userError);
    throw new Error(`Failed to create member: ${userError.message}`);
  }

  // Log the activity
  await InsertActivityLogAction(
    "Added a Member",
    `New member added: ${data.fullname}.`
  );

  return;
}

export async function UpdateMemberAction(
  userId: string,
  data: Partial<UserProfileType>
) {
  const supabase = await createClient(cookies());

  const { error: userError } = await supabase
    .from("user_profile")
    .update({ ...data, created_at: new Date() })
    .eq("id", userId)
    .select()
    .single();

  if (userError) {
    console.error("Error updating member:", userError);
    throw new Error(`Failed to update member: ${userError.message}`);
  }

  // Update auth metadata if name or role changed
  if (data.fullname || data.role !== undefined) {
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          name: data.fullname,
          role: data.role,
        },
      }
    );

    if (authError) {
      console.error("Error updating user metadata:", authError);
      throw new Error(`Failed to update user metadata: ${authError.message}`);
    }
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated a Member",
    `Member ${data.fullname} updated.`
  );

  return;
}

export async function UpdateActiveStatusMemberAction(
  userId: string,
  status: number
) {
  const supabase = await createClient(cookies());

  const { data, error: userError } = await supabase
    .from("user_profile")
    .update({ active_status: status, created_at: new Date() })
    .eq("id", userId)
    .select()
    .single();

  if (userError) {
    console.error("Error updating member:", userError);
    throw new Error(`Failed to update member: ${userError.message}`);
  }

  // Update auth metadata if name or role changed
  const { error: authError } = await supabase.auth.admin.updateUserById(
    userId,
    {
      user_metadata: {
        active_status: status,
      },
    }
  );

  if (authError) {
    console.error("Error updating user metadata:", authError);
    throw new Error(`Failed to update user metadata: ${authError.message}`);
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated Member Status",
    `Member ${data.fullname} status updated to ${status}.`
  );

  return;
}

export async function SelectAllMembersAction() {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .order("role");

  if (error) {
    console.error("Error fetching members:", error);
    throw new Error(`Failed to fetch members: ${error.message}`);
  }

  return data as UserProfileType[];
}

export async function SelectAllMembersByRoleAction(role: number) {
  const supabase = await createClient(cookies());

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
    email: emailMap.get(item.id) || "",
  }));

  return result as UserProfileType[];
}

// ASSIGNED PROJECTS ACTIONS
export async function InsertFieldTechniciansToProjectAction(
  data: string[],
  project_id: string
) {
  const supabase = await createClient(cookies());

  for (const technician_id of data) {
    // Check if the technician is already assigned to the project
    const { data: existingAssignment, error: selectError } = await supabase
      .from("assigned_projects")
      .select("*")
      .eq("user_id", technician_id)
      .eq("project_id", project_id)
      .maybeSingle();

    if (selectError) {
      console.error("Error checking existing assignment:", selectError);
      throw new Error("Failed to check existing assignment. Please try again.");
    }

    if (!existingAssignment) {
      // Insert new assignment if it doesn't exist
      const { error: insertError } = await supabase
        .from("assigned_projects")
        .insert({
          user_id: technician_id,
          project_id: project_id,
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

      // Get project details for logging
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("project_name")
        .eq("id", project_id)
        .single();
      if (projectError) {
        console.error("Error fetching project details:", projectError);
        throw new Error("Failed to fetch project details. Please try again.");
      }

      const userProfile = await SelectUserProfileByIDAction(technician_id);

      // Log the activity
      await InsertActivityLogAction(
        "Added a Field Technician to Project",
        `Field technician ${userProfile?.fullname} was added to project ${projectData.project_name}.`,
        project_id
      );
    }
  }

  return;
}

export async function DeleteFieldTechnicianFromProjectAction(
  user_id: string,
  project_id: string
) {
  const supabase = await createClient(cookies());

  // Delete the specific assignment
  const { error: deleteError } = await supabase
    .from("assigned_projects")
    .delete()
    .eq("user_id", user_id)
    .eq("project_id", project_id);

  if (deleteError) {
    console.error("Error removing field technician:", deleteError);
    throw new Error(
      "Failed to remove field technician from project. Please try again."
    );
  }

  // Get project details for logging
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("project_name")
    .eq("id", project_id)
    .single();
  if (projectError) {
    console.error("Error fetching project details:", projectError);
    throw new Error("Failed to fetch project details. Please try again.");
  }

  const existingUserData = await SelectUserProfileByIDAction(user_id);

  // Log the activity
  await InsertActivityLogAction(
    "Removed a Field Technician from Project",
    `Field technician ${existingUserData.fullname} was removed from project ${projectData.project_name}.`,
    project_id
  );

  return;
}

export async function SelectAllFieldTechniciansByProjectIDAction(
  projectID: string
) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("assigned_projects")
    .select("*, user_profile (fullname, position)")
    .eq("project_id", projectID)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching field technicians:", error);
    throw new Error(error.message);
  }

  return data as AssignedProjectsType[];
}

export async function SelectAllAssignedProjectsByFieldTechnicianIDAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const { data, error } = await supabase
    .from("assigned_projects")
    .select("project:projects!project_id(*)")
    .eq("user_id", userData.user.id);

  if (error) {
    console.error("Error fetching assigned projects:", error);
    throw new Error(error.message);
  }

  return data.map((item) => item.project) as ProjectType[];
}

// PUSH SUBSCRIPTION ACTIONS
export async function InsertSubscriptionAction(
  subscription: WebPushSubscription
) {
  const supabase = await createClient(cookies());
  const serializedSub = JSON.parse(JSON.stringify(subscription));

  const { error } = await supabase.from("push_subscriptions").upsert({
    ...serializedSub,
    user_id: (await supabase.auth.getUser()).data.user?.id,
  });

  if (error) {
    console.error("Error inserting subscription:", error);
    return false;
  }

  return true;
}

export async function DeleteSubscriptionAction(endpoint?: string) {
  const supabase = await createClient(cookies());

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .select()
    .single();

  if (error) {
    console.error("Error deleting subscription:", error);
    return false;
  }

  return true;
}

export async function SelectIfSubscribedAction(endpoint?: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("created_at")
    .eq("endpoint", endpoint);

  if (error) {
    console.error("Error checking subscription:", error);
    return false;
  }

  return data ? true : false;
}

export async function SendPushNotificationToAllAction(message: string) {
  const supabase = await createClient(cookies());
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("endpoint, expirationTime, keys");

  if (!subscriptions || subscriptions.length === 0) return;

  await Promise.all(
    subscriptions.map((subscription) =>
      webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: "Agri-Promis Notification",
          body: message,
          icon: "/icons/favicon-96x96.png",
        })
      )
    )
  );

  return;
}

export async function SendPushNotificationToUserAction(
  user_id: string,
  message: string
) {
  if (!user_id) {
    console.error("Invalid user ID for push notification");
    return;
  }
  const supabase = await createClient(cookies());
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", user_id);

  if (!subscriptions || subscriptions.length === 0) return;

  await Promise.all(
    subscriptions.map((subscription) =>
      webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: "Agri-Promis Notification",
          body: message,
          icon: "/icons/favicon-96x96.png",
        })
      )
    )
  );

  return;
}

// SESSION ACTIONS
export async function SelectUserCurrentLocationAction(user_id: string) {
  console.log("Fetching user location for user_id:", user_id);
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("user_session")
    .select("latitude, longitude, modified_at")
    .eq("user_id", user_id)
    .order("modified_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching user location:", error);
    return null;
  }

  return data;
}

export async function UpdateUserCurrentLocationAction() {
  const supabase = await createClient(cookies());
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user?.id) {
    return;
  }

  const locationData = await getLongtitudeLatitudeFromGPS();
  const response = await fetch("https://api.ipify.org?format=json");
  const ipAddress = await response.json();

  const { error } = await supabase.from("user_session").upsert(
    {
      user_id: user?.user?.id,
      longitude: locationData.longitude,
      ip_address: ipAddress.ip,
      latitude: locationData.latitude,
      modified_at: new Date(),
    },
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    console.error("Error updating user location:", error);
  }

  return;
}

export async function DeleteUserSessionAction() {
  const supabase = await createClient(cookies());
  const { data: session } = await supabase.auth.getSession();
  const { error } = await supabase
    .from("user_session")
    .delete()
    .eq(
      "session_id",
      decodeSupabaseJWT(session?.session?.access_token || "")?.session_id
    );

  if (error) {
    console.error("Error deleting user session:", error);
    return false;
  }

  return true;
}

// ACTIVITY LOG ACTIONS
export async function InsertActivityLogAction(
  code: string,
  description: string,
  project_id?: string
) {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();

  const { error } = await supabase.from("activity_logs").insert({
    user_id: userData.user.id,
    ip_address: data.ip,
    code,
    description,
    project_id: project_id || null,
  });

  if (error) {
    console.error("Error inserting activity log:", error);
    throw new Error("Failed to insert activity log");
  }

  return;
}

export async function SelectActivityLogsByUserIDAction(user_id: string) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching activity logs:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function SelectActivityLogsByProjectIDAction(project_id: string) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*, user:user_profile (fullname)")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching activity logs:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function SelectAllActivityLogsAction() {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*, user:user_profile (fullname)")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching activity logs:", error);
    throw new Error(error.message);
  }

  return data as ActivityLogType[];
}

export async function SelectAllActivityLogsByCurrentUserAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching activity logs:", error);
    throw new Error(error.message);
  }
  return data as ActivityLogType[];
}

// DASHBOARD ACTIONS
export async function SelectDashboardItemsAction(projectID: string) {
  const supabase = await createClient(cookies());
  // 1. total assigned ft
  const { data: APData, error: APError } = await supabase
    .from("assigned_projects")
    .select("*")
    .eq("project_id", projectID);

  if (APError) {
    console.error(APError.message);
    throw new Error("Failed fetching assigned_projects");
  }

  // 2. total monitoring reports
  const { data: MData, error: MError } = await supabase
    .from("monitoring")
    .select("*")
    .eq("project_id", projectID);
  if (MError) {
    console.error(MError.message);
    throw new Error("Failed fetching monitoring reports");
  }

  return { ap: APData, m: MData };
}

export async function SelectUserDashboardItemsAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  // Get travel orders
  const { data: TData, error: TError } = await supabase
    .from("travel_order")
    .select("*")
    .eq("user_id", userData.user.id)
    .gte("return_date", new Date().toISOString())
    .order("created_at", { ascending: false });
  if (TError) {
    console.error(TError.message);
    throw new Error("Failed fetching travel orders");
  }

  // Get assigned projects
  const { data: APData, error: APError } = await supabase
    .from("assigned_projects")
    .select("*")
    .eq("user_id", userData.user.id);
  if (APError) {
    console.error(APError.message);
    throw new Error("Failed fetching assigned_projects");
  }

  // Get monitoring reports
  const { data: MData, error: MError } = await supabase
    .from("monitoring")
    .select("*")
    .eq("reporter_id", userData.user.id);
  if (MError) {
    console.error(MError.message);
    throw new Error("Failed fetching monitoring reports");
  }

  return { ap: APData, m: MData, to: TData };
}

export async function SelectAdminDashboardItemsAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  // Get total users
  const { data: userCount, error: userCountError } = await supabase
    .from("user_profile")
    .select("*", { count: "exact" });

  if (userCountError) {
    console.error("Error fetching user count:", userCountError);
    throw new Error(userCountError.message);
  }

  // Get total programs
  const { data: programCount, error: programCountError } = await supabase
    .from("programs")
    .select("*", { count: "exact" });

  if (programCountError) {
    console.error("Error fetching program count:", programCountError);
    throw new Error(programCountError.message);
  }

  // Get total projects
  const { data: projectCount, error: projectCountError } = await supabase
    .from("projects")
    .select("*", { count: "exact" });

  if (projectCountError) {
    console.error("Error fetching project count:", projectCountError);
    throw new Error(projectCountError.message);
  }

  // Scheduled travel orders
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const todayStart = `${today}T00:00:00`;
  // Fetch future travel orders based on departure_date or return_date
  const { data: futureOrders, error: futureError } = await supabase
    .from("travel_order")
    .select("*, user:user_profile!travel_order_user_id_fkey (fullname)")
    .or(`departure_date.gte.${todayStart},return_date.gte.${todayStart}`)
    .limit(10);

  if (futureError) {
    console.error("Error fetching future travel orders:", futureError);
    throw new Error("Failed fetching future travel orders");
  }

  // Get last 10 activity logs
  const { data: activityLogs, error: activityLogsError } = await supabase
    .from("activity_logs")
    .select("*, user:user_profile (fullname)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (activityLogsError) {
    console.error("Error fetching activity logs:", activityLogsError);
    throw new Error(activityLogsError.message);
  }

  return {
    totalUsers: userCount?.length || 0,
    totalPrograms: programCount?.length || 0,
    totalProjects: projectCount?.length || 0,
    recentActivityLogs: activityLogs || [],
    futureTravelOrders: futureOrders || [],
  };
}

export async function SelectTravelOrdersByDateAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const todayStart = `${today}T00:00:00`;
  // Fetch future travel orders based on departure_date or return_date
  const { data: futureOrders, error: futureError } = await supabase
    .from("travel_order")
    .select("*, user:user_profile!travel_order_user_id_fkey (fullname)")
    .or(`departure_date.gte.${todayStart},return_date.gte.${todayStart}`)
    .limit(10);

  if (futureError) {
    console.error("Error fetching future travel orders:", futureError);
    throw new Error("Failed fetching future travel orders");
  }

  return futureOrders;
}
