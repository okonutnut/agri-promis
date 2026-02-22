"use server";

import { createClient } from "@/utils/supabase/server";

type SoftDeleteActionProps = {
  tableName: string;
  recordId: string;
};
export async function SoftDeleteAction({
  tableName,
  recordId,
}: SoftDeleteActionProps) {
  const supabase = await createClient();

  const { error } = await supabase
    .from(`${tableName}`)
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", `${recordId}`);

  if (error) {
    console.error("Error soft deleting record:", error);
    throw error;
  }
}
