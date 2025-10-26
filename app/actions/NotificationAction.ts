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
  //setting our previously generated VAPID keys
  webpush.setVapidDetails(
    vapidKeys.vapidEmail,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error) {
    return JSON.stringify({ error: error.message });
  } else if (data) {
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
    } catch {
      return JSON.stringify({ error: "failed to send notification" });
    }
  }
  return "{}";
};

export const sendNotificationToAll = async (message: string) => {
  const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
    vapidEmail: process.env.VAPID_ADMIN_EMAIL!,
  };
  //setting our previously generated VAPID keys
  webpush.setVapidDetails(
    vapidKeys.vapidEmail,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  const supabase = await createClient(cookies());

  const { data, error } = await supabase.from("push_subscriptions").select("*");

  if (error) {
    return JSON.stringify({ error: error.message });
  } else if (data && data.length > 0) {
    const results = await Promise.all(
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
          return { user_id: subscription.user_id, status: "success" };
        } catch {
          return { user_id: subscription.user_id, status: "failed" };
        }
      })
    );
    return JSON.stringify(results);
  }
  return JSON.stringify({ error: "No subscriptions found" });
};

export async function SelectCurrentUserSubscription() {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  if (error) {
    return null;
  } else {
    return data;
  }
}
