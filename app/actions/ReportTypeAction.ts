"use server";

import { createClient } from "@/utils/supabase/server";

export async function SelectAllReportTypesAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("report_type").select("*");

  if (error) {
    throw error;
  }

  return data;
}
