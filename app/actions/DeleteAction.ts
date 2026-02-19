"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

type SoftDeleteActionProps = {
  tableName: string;
  recordId: string;
};
export async function SoftDeleteAction({
  tableName,
  recordId,
}: SoftDeleteActionProps) {
  const supabase = await createClient(cookies());

  const { error } = await supabase
    .from(tableName)
    .update({ is_deleted: true })
    .eq("id", recordId);

  if (error) {
    throw error;
  }
}
