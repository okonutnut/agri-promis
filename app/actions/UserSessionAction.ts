"use server";

import { decodeSupabaseJWT } from "@/utils/helpers/decodeSupabaseJwt";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";

// USER SESSION ACTIONS
export async function SelectUserCurrentLocationAction(user_id: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("user_session")
    .select("latitude, longitude, modified_at")
    .eq("user_id", user_id)
    .order("modified_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function UpdateUserCurrentLocationAction(lat: string, lng: string) {
  const supabase = await createClient(cookies());
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user?.id) return;

  // ✅ Get the user's IP address
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0] ||
    hdrs.get("x-real-ip") ||
    "Unknown";

  const { error } = await supabase.from("user_session").upsert(
    {
      user_id: user.user.id,
      ip_address: ip === "::1" ? "172.0.0.1" : ip,
      longitude: lng || "0",
      latitude: lat || "0",
      modified_at: new Date(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Error updating location:", error);
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
    return false;
  }

  return true;
}
