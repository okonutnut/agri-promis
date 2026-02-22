"use server";
import { createClient } from "@/utils/supabase/server";
import webpush from "web-push";

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
};

// PUSH SUBSCRIPTION ACTIONS
export async function InsertSubscribeEndPoint(subscription: string) {
  const supabase = await createClient();

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
  const supabase = await createClient();

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq(
      "user_id",
      await supabase.auth.getUser().then(({ data }) => data.user?.id)!,
    );

  if (error) {
    return false;
  }

  return true;
}

// UNUSED QUERY - Commented out
// export async function SendPushNotificationToAllAction(message: string) {
//   webpush.setVapidDetails(
//     "mailto:" + process.env.VAPID_ADMIN_EMAIL,
//     vapidKeys.publicKey,
//     vapidKeys.privateKey
//   );

//   const supabase = await createClient();
//   const { data: subscriptions, error } = await supabase
//     .from("push_subscriptions")
//     .select("id, subscription");

//   if (error) {
//     console.error("Error fetching subscriptions:", error);
//     return;
//   }

//   if (!subscriptions || subscriptions.length === 0) {
//     return;
//   }

//   // Send notifications and handle errors for each subscription
//   const results = await Promise.allSettled(
//     subscriptions.map(async (sub) => {
//       try {
//         await webpush.sendNotification(
//           JSON.parse(sub.subscription),
//           JSON.stringify({
//             title: "New Notification",
//             body: message,
//             icon: "/icons/favicon-96x96.png",
//           })
//         );
//       } catch (error: any) {
//         // If subscription is invalid (expired, revoked, etc.), delete it
//         if (error.statusCode === 410 || error.statusCode === 404) {
//           await supabase
//             .from("push_subscriptions")
//             .delete()
//             .eq("id", sub.id);
//         } else {
//           console.error(`Error sending notification to subscription ${sub.id}:`, error);
//         }
//         throw error;
//       }
//     })
//   );

//   const failed = results.filter((r) => r.status === "rejected").length;

//   return;
// }

// UNUSED QUERY - Commented out
// export async function SendPushNotificationToUserAction(
//   user_id: string,
//   message: string
// ) {
//   if (!user_id) {
//     return;
//   }

//   webpush.setVapidDetails(
//     "mailto:" + process.env.VAPID_ADMIN_EMAIL,
//     vapidKeys.publicKey,
//     vapidKeys.privateKey
//   );

//   const supabase = await createClient();
//   const { data: subscription, error } = await supabase
//     .from("push_subscriptions")
//     .select("id, subscription")
//     .eq("user_id", user_id)
//     .maybeSingle();

//   if (error) {
//     console.error("Error fetching subscription:", error);
//     return;
//   }

//   if (!subscription) {
//     return;
//   }

//   try {
//     await webpush.sendNotification(
//       JSON.parse(subscription.subscription),
//       JSON.stringify({
//         title: "New Notification",
//         body: message,
//         icon: "/icons/favicon-96x96.png",
//       })
//     );
//   } catch (error: any) {
//     // If subscription is invalid (expired, revoked, etc.), delete it
//     if (error.statusCode === 410 || error.statusCode === 404) {
//       await supabase
//         .from("push_subscriptions")
//         .delete()
//         .eq("id", subscription.id);
//     } else {
//       console.error("Error sending notification:", error);
//     }
//     throw error;
//   }

//   return;
// }
