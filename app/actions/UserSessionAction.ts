"use server";
import { getCurrentCoords } from "@/lib/utils";
import { decodeSupabaseJWT } from "@/utils/helpers/decodeSupabaseJwt";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// USER SESSION ACTIONS
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

  const locationCoords = await getCurrentCoords();
  const response = await fetch("https://api.ipify.org?format=json");
  const ipAddress = await response.json();

  const { error } = await supabase.from("user_session").upsert(
    {
      user_id: user?.user?.id,
      longitude: locationCoords?.longitude || 0,
      ip_address: ipAddress.ip,
      latitude: locationCoords?.latitude || 0,
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
