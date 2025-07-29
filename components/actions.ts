"use server";

import {
  AssignedProjectsType,
  ProgramType,
  ProjectType,
  UserProfileType,
  MonitoringReportType,
  PostActivityReportType,
} from "@/components/types";
import { decodeSupabaseJWT } from "@/utils/decodeSupabaseJwt";
import { createClient } from "@/utils/supabase/server";
import webpush from "web-push";
import type { PushSubscription as WebPushSubscription } from "web-push";

// USER PROFILE ACTIONS
export async function SelectUserProfileByIDAction(userID: string) {
  const supabase = await createClient();
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

  return user.role as UserProfileType;
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

  // Send push notification to all subscribers
  await SendPushNotificationToAllAction("New program created");

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
  location,
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
      location: location,
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

  // Send push notification to all subscribers
  await SendPushNotificationToAllAction("New project created");

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
  status,
}: {
  project_id: string;
  project_name: string;
  status: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update({ project_name, status })
    .eq("id", project_id)
    .select()
    .single();

  if (error) {
    console.error("Error updating project name:", error);
    throw new Error("Failed to update project name. Please try again.");
  }
  return data as ProjectType;
}

export async function DeleteProjectAction(projectID: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectID);

  if (error) {
    console.error("Error deleting project:", error);
    throw new Error(error.code);
  }
  return;
}

// MONITORING REPORT ACTIONS
export async function SelectAllMonitoringReportsByProjectIDAction(
  projectID: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("monitoring")
    .select(
      `*, 
      reporter:user_profile!field_reports_reporter_id_fkey (fullname),
      remarkBy:user_profile!monitoring_reviewed_by_id_fkey (fullname)`
    )
    .eq("project_id", projectID)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching field reports:", error);
    throw new Error(error.message);
  }

  return data as MonitoringReportType[];
}

export async function SelectAllMonitoringReportsByProjectIDAndUserAction(
  projectID: string
) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const { data, error } = await supabase
    .from("monitoring")
    .select(
      `*, 
      reporter:user_profile!field_reports_reporter_id_fkey (fullname),
      reviewedBy:user_profile!monitoring_reviewed_by_id_fkey (fullname)`
    )
    .eq("reporter_id", userData.user.id)
    .eq("project_id", projectID)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching monitoring reports:", error);
    throw new Error(error.message);
  }

  return data as MonitoringReportType[];
}

export async function InsertMonitoringReportAction({
  project_id,
  images,
  location_name,
  latitude,
  longitude,
  status_note,
}: MonitoringReportType) {
  if (!images?.length) throw new Error("No images provided");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const imageFile = images.map((img) => {
    return img.file;
  });

  const photo_urls = await Promise.all(
    imageFile.map(async (file) => {
      if (!(file instanceof File)) throw new Error("Invalid file");
      const filePath = `images/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("monitoring-reports")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data: publicURL } = supabase.storage
        .from("monitoring-reports")
        .getPublicUrl(data.path);
      return publicURL.publicUrl;
    })
  );

  const { error } = await supabase
    .from("monitoring")
    .insert({
      project_id,
      reporter_id: user.id,
      photo_url: photo_urls,
      location_name,
      latitude,
      longitude,
      status_note,
    })
    .select("")
    .single();

  if (error) throw error;
  return;
}

export async function InsertRemarksInMonitoringReportAction(
  reportId: string,
  remarks: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("monitoring")
    .update({
      remarks: remarks,
      reviewed_by_id: (await supabase.auth.getUser()).data.user?.id,
    })
    .eq("id", reportId)
    .select()
    .single();

  if (error) {
    console.error("Error inserting remarks:", error);
    throw new Error("Failed to insert remarks. Please try again.");
  }

  // Send push notification to user
  await SendPushNotificationToUserAction(
    data.reporter_id,
    "Your monitoring report has been reviewed."
  );

  return;
}

// MEMBERS ACTIONS
export async function InsertMemberAction(data: UserProfileType) {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: data.email as string,
      email_confirm: true,
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
    email: data.email,
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

  return result as UserProfileType[];
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

  return result as UserProfileType[];
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
    if (error.code === "PGRST116") {
      return [];
    }
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

// POST ACTIVITY REPORTS ACTIONS
export async function InsertPostActivityReportAction(
  values: PostActivityReportType
) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const { error } = await supabase
    .from("post_activity")
    .insert({
      ...values,
      submitted_by_id: userData.user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error inserting post activity report:", error);
    throw new Error(error.message);
  }

  return;
}

export async function InsertPostActivityRemarksAction(
  values: PostActivityReportType
) {
  console.log("Inserting remarks:", values);
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const { error } = await supabase
    .from("post_activity")
    .update({
      remarks: values.remarks,
      reviewed_by_id: userData.user.id,
    })
    .eq("id", values.id);

  if (error) {
    console.error("Error inserting remarks:", error);
    throw new Error(error.message);
  }

  return;
}

export async function SelectAllPostActivityReportsByProjectIDAction(
  projectID: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("post_activity")
    .select(
      "*, submittedBy:user_profile!post_activity_submitted_by_id_fkey (fullname), reviewedBy:user_profile!post_activity_reviewed_by_id_fkey (fullname)"
    )
    .eq("project_id", projectID)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching post activity reports:", error);
    throw new Error(error.message);
  }

  return data as PostActivityReportType[];
}

export async function SelectAllPostActivityReportsByUserID() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const { data, error } = await supabase
    .from("post_activity")
    .select("*")
    .eq("submitted_by_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching post activity reports:", error);
    throw new Error(error.message);
  }

  return data as PostActivityReportType[];
}

// NOTIFICATION ACTIONS
export async function InsertSubscriptionAction(
  subscription: WebPushSubscription
) {
  const supabase = await createClient();
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
  const supabase = await createClient();

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
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { data: subscriptions, error: subError } = await supabase
    .from("push_subscriptions")
    .select("endpoint, expirationTime, keys");

  if (subError) {
    console.error("Error fetching subscriptions:", subError);
    throw new Error("Failed to fetch subscriptions");
  }
  if (!subscriptions || subscriptions.length === 0) {
    console.warn("No subscriptions found for push notifications");
    throw new Error("No subscriptions found");
  }

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

  await supabase.from("notifications").insert({
    title: "Agri-Promis Notification",
    message: message,
    public: 1,
  });

  return;
}

export async function SendPushNotificationToUserAction(
  user_id: string,
  message: string
) {
  if (!user_id) {
    console.warn("Invalid user ID for push notification");
    return;
  }
  const supabase = await createClient();
  const { data: subscriptions, error: subError } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", user_id);

  if (subError) {
    console.error("Error fetching user subscription:", subError);
    throw new Error("Failed to fetch user subscription");
  }
  if (!subscriptions || subscriptions.length === 0) {
    console.warn("No subscription found for user:", user_id);
    return;
  }
  if (!subscriptions) {
    console.warn("No valid subscription found for user:", user_id);
    return;
  }

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

  await supabase.from("notifications").insert({
    user_id: user_id,
    title: "Agri-Promis Notification",
    message: message,
    public: 0,
  });

  return;
}

// SESSION ACTIONS
export async function SelectUserCurrentLocationAction(user_id: string) {
  console.log("Fetching user location for user_id:", user_id);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_session")
    .select("latitude, longitude")
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error("Error fetching user location:", error);
    return null;
  }

  return data;
}

export async function DeleteUserSessionAction() {
  const supabase = await createClient();
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
