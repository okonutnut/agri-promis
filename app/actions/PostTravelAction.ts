"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { PostTravelReportType } from "../../components/types";

// POST TRAVEL REPORT ACTIONS
export async function SelectAllPostTravelReportsByTravelOrderIDAction(
  travelOrderID: string
) {
  const supabase = await createClient(cookies());

  // Fetch all post travel reports for the given travel order
  const { data, error } = await supabase
    .from("post_travel")
    .select(
      `
      *,
      travel_order:travel_order(travel_order_no, user_id, user:user_profile!travel_order_user_id_fkey(fullname)),
      travel_date:travel_order_itinerary_items(date, destination)
    `
    )
    .eq("travel_order_id", travelOrderID)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Map signed URLs for photos
  const reportsWithExtras = await Promise.all(
    data.map(async (report) => {
      const signedPhotoUrls = report.photo_url
        ? await Promise.all(
            report.photo_url.map(async (path: string) => {
              const { data: signed } = await supabase.storage
                .from("post-travel-reports")
                .createSignedUrl(path, 60 * 60);
              return signed?.signedUrl ?? null;
            })
          )
        : [];

      return {
        ...report,
        photo_url: signedPhotoUrls.filter(Boolean),
      };
    })
  );

  return reportsWithExtras as PostTravelReportType[];
}

export async function SelectAllPostTravelReportsByProgramIDAction(
  programID: string
) {
  const supabase = await createClient(cookies());

  // Fetch all post travel reports for travel orders in the program
  const { data, error } = await supabase
    .from("post_travel")
    .select(
      `
      *,
      travel_order:travel_order!post_travel_travel_order_id_fkey(
        travel_order_no,
        user_id,
        program_id,
        user:user_profile!travel_order_user_id_fkey(fullname)
      ),
      travel_date:travel_order_itinerary_items(date, destination)
    `
    )
    .eq("travel_order.program_id", programID)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Map signed URLs for photos
  const reportsWithExtras = await Promise.all(
    data.map(async (report) => {
      const signedPhotoUrls = report.photo_url
        ? await Promise.all(
            report.photo_url.map(async (path: string) => {
              const { data: signed } = await supabase.storage
                .from("post-travel-reports")
                .createSignedUrl(path, 60 * 60);
              return signed?.signedUrl ?? null;
            })
          )
        : [];

      return {
        ...report,
        photo_url: signedPhotoUrls.filter(Boolean),
      };
    })
  );

  return reportsWithExtras as PostTravelReportType[];
}

export async function SelectAllPostTravelReportsByCurrentUserAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw userError;
  }

  // Fetch post travel reports for travel orders created by this user
  const { data, error } = await supabase
    .from("post_travel")
    .select(
      `
      *,
      travel_order:travel_order!post_travel_travel_order_id_fkey(
        travel_order_no,
        user_id,
        user:user_profile!travel_order_user_id_fkey(fullname)
      ),
      travel_date:travel_order_itinerary_items(date, destination)
    `
    )
    .eq("travel_order.user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  // Resolve signed image URLs
  const reportsWithExtras = await Promise.all(
    data.map(async (report) => {
      const signedPhotoUrls = report.photo_url
        ? await Promise.all(
            report.photo_url.map(async (path: string) => {
              const { data: signed } = await supabase.storage
                .from("post-travel-reports")
                .createSignedUrl(path, 60 * 60);
              return signed?.signedUrl ?? null;
            })
          )
        : [];

      return {
        ...report,
        photo_url: signedPhotoUrls.filter((url) => url !== null),
      };
    })
  );

  return reportsWithExtras as PostTravelReportType[];
}

export async function InsertPostTravelReportAction({
  travel_order_id,
  travel_date_id,
  projects_places_visited,
  activities_undertaken,
  issues_concern,
  remarks,
  images,
}: PostTravelReportType & { images?: { file: File }[] }) {
  // Remove the image requirement check
  // if (!images?.length) throw new Error("No images provided");

  const supabase = await createClient(cookies());

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

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
      })
    );
  }

  // Fetch travel order details for activity log
  const { data: travelOrderData, error: toError } = await supabase
    .from("travel_order")
    .select("travel_order_no, user_id, user:user_profile!travel_order_user_id_fkey(fullname)")
    .eq("id", travel_order_id)
    .single();

  if (toError) throw toError;

  // Insert Post Travel Report to Supabase Database
  const { error } = await supabase.from("post_travel").insert({
    travel_order_id,
    travel_date_id,
    projects_places_visited,
    activities_undertaken,
    issues_concern,
    remarks,
    photo_url: photo_paths, // Will be empty array if no images
  });

  if (error) throw error;

  // Log the activity
  await InsertActivityLogAction(
    "Submitted a Post Travel Report",
    `Post travel report submitted for travel order ${travelOrderData.travel_order_no} by ${travelOrderData.user?.[0]?.fullname || "Unknown User"}.`
  );

  return;
}
