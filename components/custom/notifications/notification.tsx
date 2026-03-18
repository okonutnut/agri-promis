"use client";

import { SelectCurrentUserSubscription } from "@/app/actions/NotificationAction";
import { DeleteSubscrptionEndpoint } from "@/app/actions/SubscriptionAction";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { urlBase64ToUint8Array } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { BellOff, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NotificationRequest() {
  const qc = useQueryClient();

  const { data: subscription, isFetching } = useRealtimeQuery({
    queryKey: ["notification"],
    queryFn: async () => await SelectCurrentUserSubscription(),
    table: "push_subscriptions",
  });

  const [notificationPermission, setNotificationPermission] = useState<
    "granted" | "denied" | "default"
  >("default");

  const showNotification = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
        if (permission === "granted") {
          subscribeUser();
        } else {
          toast.info("Please go to settings and enable notification.");
        }
      });
    } else {
      toast.info("This browser does not support notifications.");
    }
  };

  const removeNotification = async () => {
    try {
      setNotificationPermission("denied");
      const isSuccess = await DeleteSubscrptionEndpoint();
      if (isSuccess) {
        toast.success("You have successfully unsubscribed from notifications.");
        qc.invalidateQueries({
          queryKey: ["notification"],
        });
      } else {
        toast.error("Cannot unsubscribe from notifications.");
      }
    } catch (ex) {
      console.error("Error unsubscribing from notifications:", ex);
      toast.error("Error unsubscribing from notifications.");
    }
  };

  async function subscribeUser() {
    if (!("serviceWorker" in navigator)) {
      toast.error("Service workers are not supported in this browser");
      return;
    }

    if (!("PushManager" in window)) {
      toast.error("Push notifications are not supported in this browser");
      return;
    }

    if (!window.isSecureContext) {
      toast.error(
        "Service workers require a secure context (HTTPS or localhost).",
      );
      return;
    }

    let registration = await navigator.serviceWorker.getRegistration();

    try {
      const swCheck = await fetch("/sw.js", { cache: "no-store" });
      if (!swCheck.ok) {
        toast.error(
          "Service worker file not found. In development, set NEXT_PUBLIC_ENABLE_PWA_DEV=true and restart the server.",
        );
        return;
      }

      if (!registration) {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        await navigator.serviceWorker.ready;
      }

      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        registration = await navigator.serviceWorker.getRegistration();
      }

      if (!registration) {
        toast.error(
          "Service worker registration failed. Please refresh the page and try again.",
        );
        return;
      }

      if (registration.installing) {
        await new Promise<void>((resolve) => {
          const installingWorker = registration?.installing;
          if (installingWorker) {
            installingWorker.addEventListener("statechange", () => {
              if (installingWorker.state === "activated") {
                resolve();
              }
            });
          } else {
            resolve();
          }
        });
      }

      if (!registration.pushManager) {
        toast.error("Push Manager is not available. Please try again.");
        return;
      }

      await generateSubscribeEndPoint(registration);
    } catch (error: any) {
      console.error("Error during service worker registration:", error);
      const errorMessage = error?.message || "Unknown error";
      toast.error(
        `Error during service worker registration: ${errorMessage}. Please check the console for details.`,
      );
    }
  }

  const generateSubscribeEndPoint = async (
    newRegistration: ServiceWorkerRegistration,
  ) => {
    try {
      if (!process.env.NEXT_PUBLIC_VAPID_KEY) {
        console.error("VAPID key is not configured");
        toast.error(
          "Push notification configuration error. Please contact support.",
        );
        return;
      }

      if (!newRegistration.pushManager) {
        console.error("PushManager is not available");
        toast.error(
          "Push Manager is not available. Please refresh the page and try again.",
        );
        return;
      }

      // Force unsubscribe any existing stale subscription before re-subscribing
      const existingPushSubscription =
        await newRegistration.pushManager.getSubscription();
      if (existingPushSubscription) {
        await existingPushSubscription.unsubscribe();
      }

      // Always create a fresh subscription with the current VAPID key
      const applicationServerKey = urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_KEY,
      );
      const subscription = await newRegistration.pushManager.subscribe({
        applicationServerKey,
        userVisibleOnly: true,
      });

      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user?.id) {
        toast.error("User not authenticated.");
        return;
      }

      const { data: existingSubscriptions, error: existingSubscriptionsError } =
        await supabase
          .from("push_subscriptions")
          .select("id")
          .eq("user_id", userData.user.id)
          .order("created_at", { ascending: false });

      if (existingSubscriptionsError) {
        toast.error(existingSubscriptionsError.message);
        return;
      }

      const primarySubscriptionId = existingSubscriptions?.[0]?.id;

      if (primarySubscriptionId) {
        const { error } = await supabase
          .from("push_subscriptions")
          .update({ subscription: JSON.stringify(subscription) })
          .eq("id", primarySubscriptionId);

        if (error) {
          toast.error(error.message);
        } else {
          // Clean up duplicates
          if ((existingSubscriptions?.length ?? 0) > 1) {
            const duplicateIds = existingSubscriptions!
              .slice(1)
              .map((row) => row.id);
            await supabase
              .from("push_subscriptions")
              .delete()
              .in("id", duplicateIds);
          }

          toast.success("Notification subscription updated successfully!");
          qc.invalidateQueries({ queryKey: ["notification"] });
        }
      } else {
        const { error } = await supabase.from("push_subscriptions").insert({
          user_id: userData.user.id,
          subscription: JSON.stringify(subscription),
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Notification subscription created successfully!");
          qc.invalidateQueries({ queryKey: ["notification"] });
        }
      }
    } catch (error: any) {
      console.error("Error generating subscription:", error);

      if (error.name === "NotAllowedError") {
        toast.error(
          "Notification permission was denied. Please enable notifications in your browser settings.",
        );
      } else if (error.name === "AbortError") {
        toast.error("Subscription was aborted. Please try again.");
      } else if (error.message?.includes("VAPID")) {
        toast.error(
          "Push notification configuration error. Please contact support.",
        );
      } else {
        toast.error(
          `Failed to subscribe to notifications: ${error.message || "Unknown error"}. Please try again.`,
        );
      }
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  if (isFetching) {
    return null;
  }

  return (
    <div className="hover:scale-110 cursor-pointer transition-all rounded-full p-2">
      {notificationPermission === "granted" && subscription != null ? (
        <BellRing onClick={removeNotification} />
      ) : (
        <BellOff onClick={showNotification} />
      )}
    </div>
  );
}