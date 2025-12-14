"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import webpush from "web-push";

export const sendNotificationToUser = async (message: string, user_id: string) => {
  const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
    vapidEmail: process.env.VAPID_ADMIN_EMAIL!,
  };
  
  webpush.setVapidDetails(
    vapidKeys.vapidEmail,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("id, subscription")
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching subscription:", error);
    return "{}";
  }

  if (!data) {
    console.log(`No subscription found for user: ${user_id}`);
    return "{}";
  }

  try {
    await webpush.sendNotification(
      JSON.parse(data.subscription),
      JSON.stringify({
        title: "New Notification",
        icon: "/favicon.ico",
        body: message,
      })
    );
    return "{}";
  } catch (error: any) {
    // If subscription is invalid (expired, revoked, etc.), delete it
    if (error.statusCode === 410 || error.statusCode === 404) {
      await supabase
        .from("push_subscriptions")
        .delete()
        .eq("id", data.id);
      console.log(`Removed invalid subscription: ${data.id}`);
    } else {
      console.error("Error sending notification:", error);
    }
    return "{}";
  }
};

export const sendNotificationToAll = async (message: string) => {
  const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
    vapidEmail: process.env.VAPID_ADMIN_EMAIL!,
  };
  
  webpush.setVapidDetails(
    vapidKeys.vapidEmail,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  const supabase = await createClient(cookies());

  const { data, error } = await supabase.from("push_subscriptions").select("id, subscription");

  if (error) {
    console.error("Error fetching subscriptions:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("No subscriptions found");
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
          })
        );
      } catch (error: any) {
        // If subscription is invalid (expired, revoked, etc.), delete it
        if (error.statusCode === 410 || error.statusCode === 404) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("id", subscription.id);
          console.log(`Removed invalid subscription: ${subscription.id}`);
        } else {
          console.error(`Error sending notification to subscription ${subscription.id}:`, error);
        }
      }
    })
  );

  return;
};

export async function SelectCurrentUserSubscription() {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
    .maybeSingle();

  if (error) {
    return null;
  }
  
  return data;
}
