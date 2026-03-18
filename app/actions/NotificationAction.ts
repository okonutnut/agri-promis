"use server";

import { createClient } from "@/utils/supabase/server";
import webpush from "web-push";

export const sendNotificationToUser = async (
  message: string,
  user_id: string,
) => {
  const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
    vapidEmail: process.env.VAPID_ADMIN_EMAIL!,
  };

  webpush.setVapidDetails(
    `mailto:${vapidKeys.vapidEmail}`,
    vapidKeys.publicKey,
    vapidKeys.privateKey,
  );

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("id, subscription")
    .eq("user_id", user_id);

  if (error) {
    console.error("Error fetching subscription:", error);
    return "{}";
  }

  if (!data || data.length === 0) {
    return "{}";
  }

  await Promise.allSettled(
    data.map(async (subscriptionRow) => {
      try {
        await webpush.sendNotification(
          JSON.parse(subscriptionRow.subscription),
          JSON.stringify({
            title: "New Notification",
            icon: "/favicon.ico",
            body: message,
          }),
        );
      } catch (error: any) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("id", subscriptionRow.id);
        } else {
          console.error("Error sending notification:", error);
        }
      }
    }),
  );

  return "{}";
};

export const sendNotificationToAll = async (message: string) => {
  const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
    vapidEmail: process.env.VAPID_ADMIN_EMAIL!,
  };

  webpush.setVapidDetails(
    `mailto:${vapidKeys.vapidEmail}`,
    vapidKeys.publicKey,
    vapidKeys.privateKey,
  );

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("id, subscription");

  if (error) {
    console.error("Error fetching subscriptions:", error);
  }

  if (!data || data.length === 0) {
    return;
  }

  // Send notifications and handle errors for each subscription
  await Promise.allSettled(
    data.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          JSON.parse(subscription.subscription),
          JSON.stringify({
            title: "New Notification",
            icon: "/favicon.ico",
            body: message,
          }),
        );
        return;
      } catch (error: any) {
        // If subscription is invalid (expired, revoked, etc.), delete it
        if (error.statusCode === 410 || error.statusCode === 404) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("id", subscription.id);
          return;
        } else {
          console.error(
            `Error sending notification to subscription ${subscription.id}:`,
            error,
          );
          return;
        }
      }
    }),
  );

  return;
};

export async function SelectCurrentUserSubscription() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return null;
  }

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}
