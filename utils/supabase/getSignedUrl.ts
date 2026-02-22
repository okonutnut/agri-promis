"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// SUPABASE UTILS

export async function getSignedUrl(path: string) {
  const supabase = createClient();

  const { data, error } = await (await supabase).storage
    .from("monitoring-reports")
    .createSignedUrl(path, 60 * 60); // 1h expiration

  if (error) throw error;
  return data.signedUrl;
}
