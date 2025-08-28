"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { FCAType } from "../../components/types";

// FCA ACTIONS

export async function InsertFCAAction(data: FCAType) {
  const supabase = await createClient(cookies());
  const { id, ...rest } = data;
  const { error } = await supabase
    .from("farmers")
    .insert({ ...rest, active_status: 1 });

  if (error) {
    console.error("Error inserting FCA:", error);
    throw new Error(error.message);
  }

  return;
}

export async function SelectAllFCAAction() {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase.from("farmers").select("*");

  if (error) {
    console.error("Error fetching all FCA:", error);
    throw new Error(error.message);
  }

  return data as FCAType[];
}

export async function SelectAllFCAByStatusAction(status: number) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("farmers")
    .select("*")
    .eq("active_status", status);

  if (error) {
    console.error("Error fetching FCA by status:", error);
    throw new Error(error.message);
  }

  return data as FCAType[];
}

export async function EditFCAAction(data: FCAType) {
  const supabase = await createClient(cookies());
  const { error } = await supabase
    .from("farmers")
    .update(data)
    .eq("id", data.id);

  if (error) {
    console.error("Error updating FCA:", error);
    throw new Error(error.message);
  }

  return;
}

export async function SelectAllAssignedProjectsByFCAIDAction(fcaID: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("projects")
    .select("project_name, created_at")
    .contains("fca_ids", [fcaID]);

  if (error) {
    console.error("Error fetching assigned projects by FCA ID:", error);
    throw new Error(error.message);
  }

  return data;
}
