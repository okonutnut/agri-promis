"use server";

import { createClient } from "@/utils/supabase/server";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { FCAType, MonitoringReportType } from "../../components/types";
import { CheckUserAssignedToProgramByProjectLocationAction } from "@/app/actions/AssignedProgramAction";
import { sendNotificationToAll, sendNotificationToUser } from "./NotificationAction";

// MONITORING REPORT ACTIONS
export async function SelectAllMonitoringReportsByProjectIDAction(
  projectLocationID: string,
) {
  const supabase = await createClient();

  // Fetch all reports for the given project location
  const { data, error } = await supabase
    .from("monitoring")
    .select(
      `
      *,
      project_location:project_location(*, projects(*)),
      travel_order:travel_order(travel_order_no, travel_itinerary:travel_order_itinerary_items(*)),
      reporter:user_profile!monitoring_reporter_id_fkey(fullname, position),
      reviewedBy:user_profile!monitoring_reviewed_by_id_fkey(fullname)
    `,
    )
    .eq("project_location_id", projectLocationID)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Collect unique FCA IDs from all reports
  const projectFCAIds = Array.from(
    new Set(
      data
        .map((report) => report.project_location?.fca_ids || [])
        .flat()
        .filter((id): id is string => !!id),
    ),
  );

  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("id, description")
    .in("id", projectFCAIds);

  if (fcaError) throw fcaError;

  const fcaMap = new Map(fcaData.map((fca) => [fca.id, fca]));

  // Optimize: Batch sign all photo URLs at once to avoid N+1
  const allPhotoUrls = Array.from(
    new Set(data.flatMap((report) => report.photo_url || [])),
  );

  const signedUrlMap = new Map<string, string | null>();
  await Promise.all(
    allPhotoUrls.map(async (path: string) => {
      const { data: signed } = await supabase.storage
        .from("monitoring-reports")
        .createSignedUrl(path, 60 * 60);
      signedUrlMap.set(path, signed?.signedUrl ?? null);
    }),
  );

  // Map FCA + signed URLs
  const reportsWithExtras = data.map((report) => {
    const signedPhotoUrls = report.photo_url
      ? report.photo_url
        .map((path: string) => signedUrlMap.get(path))
        .filter((url: string | null): url is string => url !== null)
      : [];

    const fcaDetails = report.project_location?.fca_ids
      ? report.project_location.fca_ids
        .map((id: string) => fcaMap.get(id))
        .filter((fca: FCAType): fca is (typeof fcaData)[number] =>
          Boolean(fca),
        )
      : [];

    return {
      ...report,
      photo_url: signedPhotoUrls,
      project_location: {
        ...report.project_location,
        fcaDetails,
      },
    };
  });

  return reportsWithExtras as MonitoringReportType[];
}

export async function SelectAllMonitoringReportsByProgramIDAction(
  programId: string,
) {
  const supabase = await createClient();

  // First, fetch all projects for this program
  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("program_id", programId);

  if (projectError) throw projectError;

  const projectIds = projects.map((p) => p.id);

  // If no projects, return empty array
  if (projectIds.length === 0) {
    return [];
  }

  // Then, fetch all project locations for these projects
  const { data: projectLocations, error: locError } = await supabase
    .from("project_location")
    .select("id")
    .in("project_id", projectIds);

  if (locError) throw locError;

  const projectLocationIds = projectLocations.map((loc) => loc.id);

  // If no locations, return empty array
  if (projectLocationIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("monitoring")
    .select(
      `
      *,
      project_location:project_location(*, projects(*)),
      travel_order:travel_order(travel_order_no, travel_itinerary:travel_order_itinerary_items(*)),
      reporter:user_profile!monitoring_reporter_id_fkey(fullname, position),
      reviewedBy:user_profile!monitoring_reviewed_by_id_fkey(fullname)
    `,
    )
    .in("project_location_id", projectLocationIds)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const projectFCAIds = Array.from(
    new Set(
      data
        .map((report) => report.project_location?.fca_ids || [])
        .flat()
        .filter((id): id is string => !!id),
    ),
  );

  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("id, description")
    .in("id", projectFCAIds);

  if (fcaError) throw fcaError;

  const fcaMap = new Map(fcaData.map((fca) => [fca.id, fca]));

  const allPhotoUrls = Array.from(
    new Set(data.flatMap((report) => report.photo_url || [])),
  );

  const signedUrlMap = new Map<string, string | null>();
  await Promise.all(
    allPhotoUrls.map(async (path: string) => {
      const { data: signed } = await supabase.storage
        .from("monitoring-reports")
        .createSignedUrl(path, 60 * 60);
      signedUrlMap.set(path, signed?.signedUrl ?? null);
    }),
  );

  const reportsWithExtras = data.map((report) => {
    const signedPhotoUrls = report.photo_url
      ? report.photo_url
        .map((path: string) => signedUrlMap.get(path))
        .filter((url: string | null): url is string => url !== null)
      : [];

    const fcaDetails = report.project_location?.fca_ids
      ? report.project_location.fca_ids
        .map((id: string) => fcaMap.get(id))
        .filter((fca: FCAType): fca is (typeof fcaData)[number] =>
          Boolean(fca),
        )
      : [];

    return {
      ...report,
      photo_url: signedPhotoUrls,
      project_location: {
        ...report.project_location,
        fcaDetails,
      },
    };
  });

  return reportsWithExtras as MonitoringReportType[];
}

export async function SelectAllMonitoringReportsByProjectIDAndUserAction(
  projectLocationID: string,
) {
  const supabase = await createClient();

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
      travel_order:travel_order(travel_order_no, travel_itinerary:travel_order_itinerary_items(*)),
      reporter:user_profile!monitoring_reporter_id_fkey(fullname, position),
      reviewedBy:user_profile!monitoring_reviewed_by_id_fkey(fullname)
    `,
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
        .filter((id): id is string => !!id),
    ),
  );

  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("id, description")
    .in("id", projectFCAIds);

  if (fcaError) throw fcaError;

  const fcaMap = new Map(fcaData.map((fca) => [fca.id, fca]));

  // Optimize: Batch sign all photo URLs at once to avoid N+1
  const allPhotoUrls = Array.from(
    new Set(data.flatMap((report) => report.photo_url || [])),
  );

  const signedUrlMap = new Map<string, string | null>();
  await Promise.all(
    allPhotoUrls.map(async (path: string) => {
      const { data: signed } = await supabase.storage
        .from("monitoring-reports")
        .createSignedUrl(path, 60 * 60);
      signedUrlMap.set(path, signed?.signedUrl ?? null);
    }),
  );

  // Map FCA + signed URLs
  const reportsWithExtras = data.map((report) => {
    const signedPhotoUrls = report.photo_url
      ? report.photo_url
        .map((path: string) => signedUrlMap.get(path))
        .filter((url: string | null): url is string => url !== null)
      : [];

    const fcaDetails = report.project_location?.fca_ids
      ? report.project_location.fca_ids
        .map((id: string) => fcaMap.get(id))
        .filter((fca: FCAType): fca is (typeof fcaData)[number] =>
          Boolean(fca),
        )
      : [];

    return {
      ...report,
      photo_url: signedPhotoUrls,
      project_location: {
        ...report.project_location,
        fcaDetails,
      },
    };
  });

  return reportsWithExtras as MonitoringReportType[];
}

export async function SelectAllMonitoringReportsByCurrentUserAction() {
  const supabase = await createClient();
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
      reporter:user_profile!monitoring_reporter_id_fkey(fullname, position),
      reviewedBy:user_profile!monitoring_reviewed_by_id_fkey(fullname)`,
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
        .filter((id): id is string => !!id),
    ),
  );

  const { data: fcaData, error: fcaError } = await supabase
    .from("farmers")
    .select("id, description")
    .in("id", projectFCAIds);

  if (fcaError) {
    throw fcaError;
  }

  const fcaMap = new Map(fcaData.map((fca) => [fca.id, fca]));

  // Optimize: Batch sign all photo URLs at once to avoid N+1
  const allPhotoUrls = Array.from(
    new Set(data.flatMap((report) => report.photo_url || [])),
  );

  const signedUrlMap = new Map<string, string | null>();
  await Promise.all(
    allPhotoUrls.map(async (path: string) => {
      const { data: signed } = await supabase.storage
        .from("monitoring-reports")
        .createSignedUrl(path, 60 * 60);
      signedUrlMap.set(path, signed?.signedUrl ?? null);
    }),
  );

  // Resolve signed image URLs + map FCA details
  const reportsWithExtras = data.map((report) => {
    const signedPhotoUrls = report.photo_url
      ? report.photo_url
        .map((path: string) => signedUrlMap.get(path))
        .filter((url: string | null): url is string => url !== null)
      : [];

    const fcaDetails = report.project?.fca_ids
      ? report.project.fca_ids
        .map((id: string) => fcaMap.get(id))
        .filter((fca: FCAType): fca is (typeof fcaData)[number] =>
          Boolean(fca),
        )
      : [];

    return {
      ...report,
      photo_url: signedPhotoUrls,
      project: { ...report.project, fcaDetails },
    };
  });

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
  travel_order_id,
  travel_date_id,
}: MonitoringReportType) {
  // Remove the image requirement check
  // if (!images?.length) throw new Error("No images provided");

  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Validate user is assigned to the program via assigned_fieldtechnicians
  const isAssigned = await CheckUserAssignedToProgramByProjectLocationAction(
    project_location_id as string,
  );
  if (!isAssigned) {
    throw new Error(
      "You are not assigned to this program. Please contact your administrator.",
    );
  }

  // Upload images to Supabase Storage only if images are provided
  let photo_paths: string[] = [];

  if (images && images.length > 0) {
    const imageFile = images.map((img) => {
      return img.file;
    });

    photo_paths = await Promise.all(
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
      }),
    );
  }

  // Upload Monitoring Report to Supabase Database
  const { error } = await supabase.from("monitoring").insert({
    project_location_id,
    purpose,
    observation,
    travel_date_id,
    travel_order_no: travel_order_id,
    findings: findings?.filter((f) => f !== "") || [],
    issues_concern: issues_concern?.filter((i) => i !== "") || [],
    reporter_id: user.id,
    photo_url: photo_paths, // Will be empty array if no images
    remarks: remarks,
  });

  if (error) throw error;

  // Get project location details for activity log
  const { data: project_location_data, error: locError } = await supabase
    .from("project_location")
    .select("id, location, projects(project_name)")
    .eq("id", project_location_id)
    .single();
  if (locError) throw locError;

  // Log the activity
  await InsertActivityLogAction(
    "Submitted a Monitoring Report",
    `Monitoring report submitted for project ${project_location_data?.projects[0]?.project_name}, ${project_location_data?.location}.`,
    project_location_id,
  );

  try {
    await sendNotificationToAll(
      `New monitoring report submitted for ${project_location_data?.location ?? "location"}.`,
    );
  } catch (notificationError) {
    console.error(
      "Failed to send monitoring submission notification:",
      notificationError,
    );
  }

  return;
}

export async function InsertRemarksInMonitoringReportAction(reportId: string) {
  const supabase = await createClient();

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
    .select(
      `
      id,
      project_location_id,
      reporter_id,
      travel_order_no,
      travel_order:travel_order!monitoring_travel_order_no_fkey(travel_order_no)
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  const travelOrderNo = data?.travel_order?.[0]?.travel_order_no || "Unknown";

  await InsertActivityLogAction(
    "Reviewed a Monitoring Report",
    `Monitoring report with T.O no ${travelOrderNo} has been reviewed.`,
    data?.project_location_id,
  );

  try {
    if (data?.reporter_id) {
      await sendNotificationToUser(
        `Your monitoring report for T.O no ${travelOrderNo} has been reviewed.`,
        data.reporter_id,
      );
    }
  } catch (notificationError) {
    console.error(
      "Failed to send monitoring review notification:",
      notificationError,
    );
  }

  return;
}
