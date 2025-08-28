"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import webpush, {
  type PushSubscription as WebPushSubscription,
} from "web-push";

// PUSH SUBSCRIPTION ACTIONS

export async function InsertSubscriptionAction(
  subscription: WebPushSubscription
) {
  const supabase = await createClient(cookies());
  const serializedSub = JSON.parse(JSON.stringify(subscription));

  const { error } = await supabase.from("push_subscriptions").upsert({
    ...serializedSub,
    user_id: (await supabase.auth.getUser()).data.user?.id,
  });

  if (error) {
    console.error("Error inserting subscription:", error);
    return false;
  }

  return true;
}

export async function DeleteSubscriptionAction(endpoint?: string) {
  const supabase = await createClient(cookies());

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .select()
    .single();

  if (error) {
    console.error("Error deleting subscription:", error);
    return false;
  }

  return true;
}

export async function SelectIfSubscribedAction(endpoint?: string) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("created_at")
    .eq("endpoint", endpoint);

  if (error) {
    console.error("Error checking subscription:", error);
    return false;
  }

  return data ? true : false;
}

export async function SendPushNotificationToAllAction(message: string) {
  const supabase = await createClient(cookies());
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("endpoint, expirationTime, keys");

  if (!subscriptions || subscriptions.length === 0) return;

  await Promise.all(
    subscriptions.map((subscription) =>
      webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: "Agri-Promis Notification",
          body: message,
          icon: "/icons/favicon-96x96.png",
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
  if (!user_id) {
    console.error("Invalid user ID for push notification");
    return;
  }
  const supabase = await createClient(cookies());
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", user_id);

  if (!subscriptions || subscriptions.length === 0) return;

  await Promise.all(
    subscriptions.map((subscription) =>
      webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: "Agri-Promis Notification",
          body: message,
          icon: "/icons/favicon-96x96.png",
        })
      )
    )
  );

  return;
}
