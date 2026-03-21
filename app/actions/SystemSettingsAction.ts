"use server";

import { createClient } from "@/utils/supabase/server";

export async function UpsertSettings(settingsName: string, valuesJson: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("settings").upsert(
    {
      settings_name: settingsName,
      form_schema: valuesJson,
    },
    { onConflict: "settings_name" },
  );

  if (error) throw error;
}

export async function SelectSettings(settingsName: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("settings_name", settingsName)
    .maybeSingle();

  console.log("SelectSettings", { data, error });

  if (error) throw error;
  return data ? JSON.parse(data.form_schema) : null;
}
