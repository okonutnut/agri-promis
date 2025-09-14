"use server";
import { ProjectType } from "@/components/types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function SelectProjectByIDsAction(projectIDs: string[]) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("projects")
    .select("id, project_name, location")
    .in("id", projectIDs)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching projects by IDs:", error);
    throw new Error(error.message);
  }

  return data as ProjectType[];
}
