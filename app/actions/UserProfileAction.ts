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
    return Promise.reject();
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
    return Promise.reject();
  }

  return data as UserProfileType;
}

export async function SelectUserProfileAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return Promise.reject();
  }

  const { data: user } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", userData.user?.id)
    .single();

  if (!user) {
    return Promise.reject();
  }

  return user as UserProfileType;
}
