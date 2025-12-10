"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function SelectAllReportTypesAction() {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase.from("report_type").select("*");

  if (error) {
    throw error;
  }

  return data;
}
