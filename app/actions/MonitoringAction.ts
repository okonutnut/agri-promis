"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { MonitoringReportType } from "../../components/types";

// MONITORING REPORT ACTIONS
export async function SelectAllMonitoringReportsByProjectIDAction(
  projectLocationID: string
) {
  const supabase = await createClient(cookies());

  // Step 1: Fetch monitoring reports with joins
  const { data, error } = await supabase
    .from("monitoring")
    .select(
      `
      *,
      project_location:project_location(id, project_id, location, fca_ids),
      project:project_location!monitoring_project_location_id_fkey(
        projects(project_name)
      ),
      travel_order:travel_order(travel_order_no),
      reporter:user_profile!monitoring_reporter_id_fkey(fullname),
      remarkBy:user_profile!monitoring_reviewed_by_id_fkey(fullname)
    `
    )
    .eq("project_location_id", projectLocationID)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Step 2: Gather FCA IDs
  const fcaIds = Array.from(
    new Set(
      data
        .map((r) => r.project_location?.fca_ids || [])
        .flat()
        .filter((id): id is string => !!id)
    )
  );

  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("id, description")
    .in("id", fcaIds);

  if (fcaError) throw new Error(fcaError.message);

  // Step 3: Attach FCA + sign URLs
  const reports = await Promise.all(
    data.map(async (report) => {
      const signedPhotos = report.photo_url
        ? await Promise.all(
            report.photo_url.map(async (path: string) => {
              const { data: signed } = await supabase.storage
                .from("monitoring-reports")
                .createSignedUrl(path, 3600);
              return signed?.signedUrl ?? null;
            })
          )
        : [];

      const fcaDetails = report.project_location?.fca_ids
        ? fcaData.filter((fca) =>
            report.project_location?.fca_ids.includes(fca.id)
          )
        : [];

      return {
        ...report,
        photo_url: signedPhotos.filter(Boolean),
        project_location: {
          ...report.project_location,
          fcaDetails,
        },
      };
    })
  );

  return reports;
}

export async function SelectAllMonitoringReportsByProjectIDAndUserAction(
  projectLocationID: string
) {
  const supabase = await createClient(cookies());

  // Get logged-in user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) throw userError;

  // Fetch reports from this user for the project location
  const { data, error } = await supabase
    .from("monitoring")
    .select(
      `
      *,
      project_location:project_location(*, projects(*)),
      travel_order:travel_order(travel_order_no),
      report_type:report_type(description),
      reporter:user_profile!monitoring_reporter_id_fkey(fullname),
      reviewedBy:user_profile!monitoring_reviewed_by_id_fkey(fullname)
    `
    )
    .eq("reporter_id", userData.user.id)
    .eq("project_location_id", projectLocationID)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Collect unique FCA IDs from all reports
  const projectFCAIds = Array.from(
    new Set(
      data
        .map((report) => report.project_location?.fca_ids || [])
        .flat()
        .filter((id): id is string => !!id)
    )
  );

  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("id, description")
    .in("id", projectFCAIds);

  if (fcaError) throw fcaError;

  // Map FCA + signed URLs
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

      const fcaDetails = report.project_location?.fca_ids
        ? fcaData.filter((fca) =>
            report.project_location?.fca_ids.includes(fca.id)
          )
        : [];

      return {
        ...report,
        photo_url: signedPhotoUrls.filter(Boolean),
        project_location: {
          ...report.project_location,
          fcaDetails,
        },
      };
    })
  );

  return reportsWithExtras as MonitoringReportType[];
}

export async function SelectAllMonitoringReportsByCurrentUserAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw userError;
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
    throw error;
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
    throw fcaError;
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
  project_location_id,
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
    project_location_id,
    purpose,
    findings: findings?.filter((f) => f !== "") || [],
    issues_concern: issues_concern?.filter((i) => i !== "") || [],
    reporter_id: user.id,
    observation,
    photo_url: photo_paths,
    remarks: remarks,
  });

  if (error) throw error;

  // Get project name for logging
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("*, project_location!inner (*)")
    .eq("project_location.id", project_location_id)
    .single();

  if (projectError) {
    throw projectError;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Submitted a Monitoring Report",
    `Monitoring report submitted for project ${projectData.project_name}, ${projectData.project_location?.location}.`,
    project_location_id
  );

  // Send Notification to admin
  // const { data: programData, error: programError } = await supabase
  //   .from("projects")
  //   .select(
  //     "program_id, project_name, programs!projects_program_id_fkey(admin_id)"
  //   )
  //   .eq("id", project_id)
  //   .limit(1, { foreignTable: "programs" })
  //   .single();

  // if (programError) {
  //   throw programError;
  // }

  return;
}

export async function InsertRemarksInMonitoringReportAction(reportId: string) {
  const supabase = await createClient(cookies());

  // auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("monitoring")
    .update({
      reviewed_by_id: user.id,
      reviewed_at: new Date(),
    })
    .eq("id", reportId)
    .select("project_location_id, travel_order_no")
    .single();

  if (error) {
    throw error;
  }

  const { data: toData, error: toError } = await supabase
    .from("travel_order")
    .select("travel_order_no")
    .eq("id", data.travel_order_no)
    .single();

  if (toError) {
    throw toError;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Reviewed a Monitoring Report",
    `Monitoring report with T.O no ${toData.travel_order_no} has been reviewed.`,
    data?.project_location_id
  );

  return;
}
