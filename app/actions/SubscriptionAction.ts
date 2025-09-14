"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import webpush from "web-push";

// PUSH SUBSCRIPTION ACTIONS
export async function InsertSubscribeEndPoint(subscription: string) {
  const supabase = await createClient(cookies());

  const { error } = await supabase.from("push_subscriptions").insert({
    user_id: await supabase.auth.getUser().then(({ data }) => data.user?.id),
    subscription: JSON.stringify(subscription),
  });

  if (error) {
    return false;
  }

  return true;
}

export async function DeleteSubscrptionEndpoint() {
  const supabase = await createClient(cookies());

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq(
      "user_id",
      await supabase.auth.getUser().then(({ data }) => data.user?.id)!
    );

  if (error) {
    return false;
  }

  return true;
}

export async function SendPushNotificationToAllAction(message: string) {
  const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
    privateKey: process.env.VAPID_PRIVATE_KEY || "",
  };
  webpush.setVapidDetails(
    "mailto:" + process.env.VAPID_ADMIN_EMAIL,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  const supabase = await createClient(cookies());
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("subscription");

  if (error) return;

  await Promise.all(
    subscriptions.map((subscription) =>
      webpush.sendNotification(
        JSON.parse(subscription.subscription),
        JSON.stringify({
          title: "New Notification",
          icon: "/icons/favicon-96x96.png",
          body: message,
        })
      )
    )
  );

  return;
}

export async function SendPushNotificationToUserAction(
  user_id: string,
  message: string
) {
  const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
    privateKey: process.env.VAPID_PRIVATE_KEY || "",
  };
  webpush.setVapidDetails(
    "mailto:" + process.env.VAPID_ADMIN_EMAIL,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  if (!user_id) {
    return;
  }

  const supabase = await createClient(cookies());
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error) return;

  webpush.sendNotification(
    JSON.parse(subscriptions.subscription),
    JSON.stringify({
      title: "New Notification",
      body: message,
      icon: "/icons/favicon-96x96.png",
    })
  );

  return;
}
