"use server";

import { createClient } from "@/utils/supabase/client";
import webpush from "web-push";

export const sendNotification = async (message: string, user_id: string) => {
  const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
  };
  //setting our previously generated VAPID keys
  webpush.setVapidDetails(
    "mailto:myuserid@email.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  const supabase = createClient();

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
