"use server";

import {
  AssignedProjectsType,
  ProgramType,
  ProjectType,
  UserProfileType,
  MonitoringReportType,
  TravelOrderType,
  ActivityLogType,
} from "@/components/types";
import { decodeSupabaseJWT } from "@/utils/helpers/decodeSupabaseJwt";
import { createClient } from "@/utils/supabase/server";
import webpush from "web-push";
import type { PushSubscription as WebPushSubscription } from "web-push";
import { cookies } from "next/headers";

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
    `Program ${
      program_name as string
    } created on ${new Date().toLocaleDateString()}`
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

export async function DeleteProgramAction(programID: string) {
  const supabase = await createClient(cookies());
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
export async function InsertProjectAction(values: ProjectType) {
  const supabase = await createClient(cookies());
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data, error } = await supabase
    .from("projects")
    .insert({
      ...values,
      status: 1,
      created_by: userId,
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
    `Project ${
      values.project_name as string
    } created on ${new Date().toLocaleDateString()}`
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

  return data as ProjectType & { programs: ProgramType };
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

export async function EditProjectNameAction({
  project_id,
  project_name,
  status,
}: {
  project_id: string;
  project_name: string;
  status: number;
}) {
  const supabase = await createClient(cookies());
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
  const supabase = await createClient(cookies());
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

  // Log the activity
  await InsertActivityLogAction(
    "Created a Travel Order",
    `Travel order created for ${
      data.purpose
    } on ${new Date().toLocaleDateString()}`
  );

  return;
}

export async function SelectAllTravelOrdersByUserIDAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const { data, error } = await supabase
    .from("travel_order")
    .select(
      `*, project:projects(id, project_name), user:user_profile!travel_order_user_id_fkey(fullname),
      created_by:user_profile!travel_order_created_by_fkey(fullname)`
    )
    .eq("user_id", userData.user.id)
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
  const supabase = await createClient(cookies());
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
  purpose,
  findings,
  observation,
  issues_concern,
  images,
  remarks,
}: MonitoringReportType) {
  if (!images?.length) throw new Error("No images provided");

  const supabase = await createClient(cookies());
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

  const { error } = await supabase.from("monitoring").insert({
    project_id,
    purpose,
    findings,
    issues_concern,
    reporter_id: user.id,
    observation,
    photo_url: photo_urls,
    remarks,
  });

  if (error) throw error;

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
    `Monitoring report created for project ${
      projectData.project_name as string
    } on ${new Date().toLocaleDateString()}`
  );

  return;
}

export async function InsertRemarksInMonitoringReportAction(
  reportId: string,
  remarks: string
) {
  const supabase = await createClient(cookies());
  const { error } = await supabase
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

  const { error: userError } = await supabase.from("user_profile").insert({
    id: authData.user.id,
    ...data,
  });

  if (userError) {
    console.error("Error creating field technician:", userError);
    throw new Error(`Failed to create field technician: ${userError.message}`);
  }

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

  return;
}

export async function UpdateActiveStatusMemberAction(
  userId: string,
  status: number
) {
  const supabase = await createClient(cookies());

  const { error: userError } = await supabase
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
export async function InsertFieldTechnicianToProjectAction(
  data: AssignedProjectsType,
  project_id: string
) {
  const supabase = await createClient(cookies());

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

export async function DeleteFieldTechnicianFromProjectAction(
  user_id: string,
  project_id: string
) {
  const supabase = await createClient(cookies());

  // Fetch current project assignments
  const { data: existingUser, error: selectError } = await supabase
    .from("assigned_projects")
    .select("project_ids")
    .eq("user_id", user_id)
    .single();

  if (selectError) {
    console.error("Error checking existing user:", selectError);
    throw new Error("Failed to check existing user. Please try again.");
  }

  // Remove project_id from array
  const updatedProjects = existingUser.project_ids.filter(
    (id: string) => id !== project_id
  );

  // If no projects left, delete the record, otherwise update
  if (updatedProjects.length === 0) {
    const { error: deleteError } = await supabase
      .from("assigned_projects")
      .delete()
      .eq("user_id", user_id);

    if (deleteError) {
      console.error("Error removing field technician:", deleteError);
      throw new Error(
        "Failed to remove field technician from project. Please try again."
      );
    }
  } else {
    const { error: updateError } = await supabase
      .from("assigned_projects")
      .update({ project_ids: updatedProjects })
      .eq("user_id", user_id);

    if (updateError) {
      console.error("Error updating assigned projects:", updateError);
      throw new Error(
        "Failed to remove project from field technician. Please try again."
      );
    }
  }

  return;
}

export async function SelectAllFieldTechniciansByProjectIDAction(
  projectID: string
) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("assigned_projects")
    .select("*, user_profile (fullname, position)")
    .contains("project_ids", [projectID])
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching field technicians:", error);
    throw new Error(error.message);
  }

  return data as AssignedProjectsType[];
}

export async function SelectAllAssignedProjectsByFieldTechnicianIDAction() {
  const supabase = await createClient(cookies());
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
  description: string
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

// DASHBOARD ACTIONS
export async function SelectDashboardItemsAction(projectID: string) {
  const supabase = await createClient(cookies());
  // project progress percent - last
  // total assigned ft
  const { data: APData, error: APError } = await supabase
    .from("assigned_projects")
    .select("*")
    .contains("project_ids", [projectID]);
  if (APError) {
    console.error(APError.message);
    throw new Error("Failed fetching assigned_projects");
  }
  // total monitoring reports
  const { data: MData, error: MError } = await supabase
    .from("monitoring")
    .select("*")
    .eq("project_id", projectID);
  if (MError) {
    console.error(MError.message);
    throw new Error("Failed fetching assigned_projects");
  }

  return { ap: APData, m: MData };
}
