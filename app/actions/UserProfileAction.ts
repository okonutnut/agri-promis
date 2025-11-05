"use server";

import { UserProfileType } from "@/components/types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// USER PROFILE ACTIONS
export async function SelectAllUserProfilesAction() {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .order("fullname", { ascending: true });
  if (error) {
    throw error;
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
    throw error;
  }

  return data as UserProfileType;
}

export async function SelectUserProfileAction() {
  const supabase = await createClient(cookies());
  const user = (await supabase.auth.getUser()).data.user?.id;

  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", user)
    .single();

  if (error) {
    throw error;
  }

  return data as UserProfileType;
}
