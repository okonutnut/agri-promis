"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/server-admin";
import { InsertActivityLogAction } from "./ActivityLogAction";
import { sendNotificationToAll, sendNotificationToUser } from "./NotificationAction";

type SoftDeleteActionProps = {
  tableName: string;
  recordId: string;
};

export async function SoftDeleteAction({ tableName, recordId }: SoftDeleteActionProps) {
  const supabase = await createClient();       // cookie-based, for reading context
  const supabaseAdmin = createAdminClient();   // true service role, bypasses RLS

  let notificationTargetUserId: string | null = null;
  let notificationMessage = "";
  let activityCode = "Deleted a Record";
  let activityDescription = "A record has been deleted.";
  let activityProjectLocationId: string | undefined = undefined;

  try {
    if (tableName === "programs") {
      const { data } = await supabase.from("programs").select("program_name").eq("id", recordId).maybeSingle();
      notificationMessage = `Program deleted: ${data?.program_name ?? recordId}.`;
      activityCode = "Deleted a Program";
      activityDescription = `Program deleted: ${data?.program_name ?? recordId}.`;
    } else if (tableName === "projects") {
      const { data } = await supabase.from("projects").select("project_name").eq("id", recordId).maybeSingle();
      notificationMessage = `Project deleted: ${data?.project_name ?? recordId}.`;
      activityCode = "Deleted a Project";
      activityDescription = `Project deleted: ${data?.project_name ?? recordId}.`;
    } else if (tableName === "project_location") {
      const { data } = await supabase.from("project_location").select("location").eq("id", recordId).maybeSingle();
      notificationMessage = `Project location deleted: ${data?.location ?? recordId}.`;
      activityCode = "Deleted a Project Location";
      activityDescription = `Project location deleted: ${data?.location ?? recordId}.`;
      activityProjectLocationId = recordId;
    } else if (tableName === "travel_order") {
      const { data } = await supabase.from("travel_order").select("travel_order_no, user_id").eq("id", recordId).maybeSingle();
      notificationTargetUserId = data?.user_id ?? null;
      notificationMessage = `Travel order deleted: ${data?.travel_order_no ?? recordId}.`;
      activityCode = "Deleted a Travel Order";
      activityDescription = `Travel order deleted: ${data?.travel_order_no ?? recordId}.`;
    } else {
      notificationMessage = `${tableName.replaceAll("_", " ")} deleted.`;
    }
  } catch (contextError) {
    console.error("Failed to gather delete notification context:", contextError);
    notificationMessage = `${tableName.replaceAll("_", " ")} deleted.`;
  }

  // ✅ Use admin client here — true service role, not overridden by cookie session
  const { error } = await supabaseAdmin
    .from(tableName)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", recordId);

  if (error) {
    console.error("Error soft deleting record:", error);
    throw error;
  }

  try {
    await InsertActivityLogAction(activityCode, activityDescription, activityProjectLocationId);
  } catch (activityLogError) {
    console.error("Failed to insert delete activity log:", activityLogError);
  }

  try {
    if (tableName === "travel_order" && notificationTargetUserId) {
      await sendNotificationToUser(notificationMessage, notificationTargetUserId);
    } else {
      await sendNotificationToAll(notificationMessage);
    }
  } catch (notificationError) {
    console.error("Failed to send delete notification:", notificationError);
  }
}