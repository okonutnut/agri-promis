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
    console.error("Error fetching user profiles:", error);
    throw new Error(error.message);
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
    console.error("Error fetching user profile:", error);
    throw new Error(error.message);
  }

  return data as UserProfileType;
}

export async function SelectUserProfileAction() {
  const supabase = await createClient(cookies());
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "User not authenticated");
  }

  const { data: user } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", userData.user?.id)
    .single();

  if (!user) {
    console.error("User profile not found for ID:", userData.user.id);
    throw new Error("User profile not found");
  }

  return user as UserProfileType;
}
