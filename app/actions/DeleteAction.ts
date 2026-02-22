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
  const userID = (await supabase.auth.getUser()).data.user?.id;

  console.log("Soft deleting record:", {
    tableName,
    recordId,
    user: userID,
  });

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
