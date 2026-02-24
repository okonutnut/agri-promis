"use server";

import { createClient } from "@/utils/supabase/server";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { PostTravelReportType } from "../../components/types";
import { CheckUserAssignedToProgramAction } from "@/app/actions/AssignedProgramAction";
import { PostTravelWithDetails } from "../types";
import { sendNotificationToUser } from "./NotificationAction";

export async function SelectAllPostTravelReportsByProgramIDAction(
  programID: string,
) {
  const supabase = await createClient();

  // Fix: Filter directly on post_travel.program_id instead of through join
  // This ensures proper isolation between programs
  const { data, error } = await supabase
    .from("post_travel_with_order")
    .select(`*`)
    .eq("program_id", programID)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Optimize: Batch sign all photo URLs at once to avoid N+1
  const allPhotoUrls = data
    .flatMap((report) => report.photo_url || [])
    .filter((url, index, self) => self.indexOf(url) === index); // Get unique URLs

  const signedUrlMap = new Map<string, string | null>();
  await Promise.all(
    allPhotoUrls.map(async (path: string) => {
      const { data: signed } = await supabase.storage
        .from("post-travel-reports")
        .createSignedUrl(path, 60 * 60);
      signedUrlMap.set(path, signed?.signedUrl ?? null);
    }),
  );

  // Map signed URLs for photos
  const reportsWithExtras = data.map((report) => {
    const signedPhotoUrls = report.photo_url
      ? report.photo_url
          .map((path: string) => signedUrlMap.get(path))
          .filter((url: string | null): url is string => url !== null)
      : [];

    return {
      ...report,
      photo_url: signedPhotoUrls,
    };
  });

  return reportsWithExtras as PostTravelWithDetails[];
}

export async function SelectAllPostTravelReportsByCurrentUserAction() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw userError;
  }

  // Fetch post travel reports for travel orders assigned to this user
  const { data, error } = await supabase
    .from("post_travel_with_order")
    .select(`*`)
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  // Optimize: Batch sign all photo URLs at once to avoid N+1
  const allPhotoUrls = data
    .flatMap((report) => report.photo_url || [])
    .filter((url, index, self) => self.indexOf(url) === index); // Get unique URLs

  const signedUrlMap = new Map<string, string | null>();
  await Promise.all(
    allPhotoUrls.map(async (path: string) => {
      const { data: signed } = await supabase.storage
        .from("post-travel-reports")
        .createSignedUrl(path, 60 * 60);
      signedUrlMap.set(path, signed?.signedUrl ?? null);
    }),
  );

  // Resolve signed image URLs
  const reportsWithExtras = data.map((report) => {
    const signedPhotoUrls = report.photo_url
      ? report.photo_url
          .map((path: string) => signedUrlMap.get(path))
          .filter((url: string | null): url is string => url !== null)
      : [];

    return {
      ...report,
      photo_url: signedPhotoUrls,
    };
  });

  return reportsWithExtras as PostTravelWithDetails[];
}

export async function InsertPostTravelReportAction({
  program_id,
  travel_order_id,
  travel_date_id,
  projects_places_visited,
  activities_undertaken,
  issues_concern,
  remarks,
  images,
}: PostTravelReportType & { images?: { file: File }[] }) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Validate user is assigned to the program via assigned_fieldtechnicians
  if (!program_id) {
    throw new Error("Program ID is required.");
  }
  const isAssigned = await CheckUserAssignedToProgramAction(program_id);
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
          .from("post-travel-reports")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;

        return filePath;
      }),
    );
  }

  // Insert Post Travel Report to Supabase Database
  const { data, error } = await supabase
    .from("post_travel")
    .insert({
      program_id,
      travel_order_id,
      travel_date_id,
      projects_places_visited,
      activities_undertaken,
      issues_concern,
      remarks,
      // user_id: user.id,
      photo_url: photo_paths, // Will be empty array if no images
    })
    .select("*, travel_order:travel_order(travel_order_no)")
    .single();

  if (error) throw error;

  // Log the activity
  await InsertActivityLogAction(
    "Submitted a Post Travel Report",
    `Post travel report submitted for travel order ${data.travel_order.travel_order_no}.`,
  );

  try {
    const { data: programData, error: programError } = await supabase
      .from("programs")
      .select("admin_id")
      .eq("id", program_id)
      .single();

    if (programError) throw programError;

    if (programData?.admin_id) {
      await sendNotificationToUser(
        `New post-travel report submitted for travel order ${data.travel_order.travel_order_no}.`,
        programData.admin_id,
      );
    }
  } catch (notificationError) {
    console.error(
      "Failed to send post-travel submission notification:",
      notificationError,
    );
  }

  return;
}

export async function ReviewPostTravelAction(postTravelID: string) {
  const supabase = await createClient();

  // Get the current user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    throw new Error("Failed to retrieve the current user.");
  }

  // Update the post_travel record
  const { data, error } = await supabase
    .from("post_travel")
    .update({
      reviewer_id: userData.user.id, // Ensure this matches the schema
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", postTravelID)
    .select(
      `
      *,
      travel_order(travel_order_no)
    `,
    )
    .single();

  if (error) throw error;

  // Validate the returned data
  const travelOrderNo = data?.travel_order?.travel_order_no || "Unknown";

  // Log the activity
  await InsertActivityLogAction(
    "Reviewed a Post Travel Report",
    `Reviewed a Post travel report submitted for travel order ${travelOrderNo}.`,
  );

  try {
    const { data: postTravelOwner, error: postTravelOwnerError } =
      await supabase
        .from("post_travel_owner")
        .select(`*`)
        .eq("id", postTravelID)
        .single();

    if (postTravelOwnerError) throw postTravelOwnerError;

    const reportOwnerId = postTravelOwner?.user_id;

    if (reportOwnerId) {
      await sendNotificationToUser(
        `Your post-travel report for travel order ${travelOrderNo} has been reviewed.`,
        reportOwnerId,
      );
    }
  } catch (notificationError) {
    console.error(
      "Failed to send post-travel review notification:",
      notificationError,
    );
  }

  return;
}
