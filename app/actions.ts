"use server";

import {
  DeleteSubscriptionAction,
  InsertSubscriptionAction,
} from "@/app/actions/SubscriptionAction";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:darlitocabalse.acad@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

import type { PushSubscription as WebPushSubscription } from "web-push";

let subscription: WebPushSubscription | null = null;

export async function subscribeUser(sub: WebPushSubscription) {
  subscription = sub;
  const res = await InsertSubscriptionAction(sub);
  if (!res) {
    console.error("Failed to insert subscription");
    return { success: false, error: "Failed to insert subscription" };
  }
  return { success: true };
}

export async function unsubscribeUser(endpoint?: string) {
  subscription = null;
  const res = await DeleteSubscriptionAction(endpoint);
  if (!res) {
    console.error("Failed to delete subscription");
    return { success: false, error: "Failed to delete subscription" };
  }
  return { success: true };
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error("No subscription available");
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Agri-Promis Notification",
        body: message,
        icon: "/icons/favicon-96x96.png",
      })
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
