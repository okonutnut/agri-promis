"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { MonitoringReportType } from "../../components/types";
import { SendPushNotificationToUserAction } from "./SubscriptionAction";

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

  // Send Notification to admin
  const { data: programData, error: programError } = await supabase
    .from("projects")
    .select(
      "program_id, project_name, programs!projects_program_id_fkey(admin_id)"
    )
    .eq("id", project_id)
    .limit(1, { foreignTable: "programs" })
    .single();

  if (programError) {
    console.error("Error fetching project data:", programError);
    throw new Error("Failed to fetch project data. Please try again.");
  }

  for (const admin of programData.programs[0].admin_id) {
    await SendPushNotificationToUserAction(
      admin,
      `A new monitoring report has been submitted for project ${programData.project_name.toString()}.`
    );
  }

  return;
}

export async function InsertRemarksInMonitoringReportAction(
  reportId: string,
  remarks: string
) {
  const supabase = await createClient(cookies());

  // auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("monitoring")
    .update({
      remarks,
      reviewed_by_id: user.id,
      reviewed_at: new Date(),
    })
    .eq("id", reportId)
    .select("project_id, travel_order_no")
    .single();

  if (error) {
    console.error("Error inserting remarks:", error);
    throw new Error("Failed to insert remarks. Please try again.");
  }

  const { data: toData, error: toError } = await supabase
    .from("travel_order")
    .select("travel_order_no")
    .eq("id", data.travel_order_no)
    .single();

  if (toError) {
    console.error("Error fetching report data:", toError);
    throw new Error("Failed to fetch report data. Please try again.");
  }

  // Log the activity
  await InsertActivityLogAction(
    "Reviewed a Monitoring Report",
    `Monitoring report with T.O no ${toData.travel_order_no} has been reviewed.`,
    data?.project_id
  );

  // Send Notification to reporter
  await SendPushNotificationToUserAction(
    user.id,
    `Your monitoring report with T.O no ${toData.travel_order_no.toString()} has been reviewed.`
  );

  return;
}
