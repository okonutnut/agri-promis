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
    console.error(error);
    return;
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
    } catch (error) {
      console.error(error);
      return;
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
    console.error(error);
    return;
  } else if (data && data.length > 0) {
     await Promise.all(
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
          return;
        } catch (error) {
          console.error(error);
          return;
        }
      })
    );
    return;
  }
  console.error("No subscriptions found");
  return;
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
