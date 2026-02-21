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
  const userID = (await supabase.auth.getUser()).data.user?.id;

  console.log("Soft deleting record:", {
    tableName,
    recordId,
    user: userID,
  });

  const { data, error } = await supabase
    .from(tableName as string)
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", recordId)
    .select("*");

  if (error) {
    console.error("Error soft deleting record:", error);
    throw error;
  }
}
