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
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw userError;
  }

  const { data: user, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", userData.user?.id)
    .single();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("User not found");
  }

  return user as UserProfileType;
}
