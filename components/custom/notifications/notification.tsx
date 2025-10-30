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
    queryFn: SelectCurrentUserSubscription,
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
          toast.info("please go to setting and enable notification.");
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
        toast("You have successfully unsubscribed from notifications.");
      } else {
        toast.error("Cannot unsubscribe from notifications.");
      }
    } catch (ex) {
      console.error("Error unsubscribing from notifications:", ex);
      toast.error("Error unsubscribing from notifications.");
    } finally {
    }
  };

  async function subscribeUser() {
    if ("serviceWorker" in navigator) {
      try {
        // Check if service worker is already registered
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          generateSubscribeEndPoint(registration);
        } else {
          // Register the service worker
          const newRegistration = await navigator.serviceWorker.register(
            "/sw.js"
          );
          // Subscribe to push notifications
          generateSubscribeEndPoint(newRegistration);
        }
      } catch {
        toast.error(
          "Error during service worker registration or subscription:"
        );
      }
    } else {
      toast.error("Service workers are not supported in this browser");
    }
  }

  const generateSubscribeEndPoint = async (
    newRegistration: ServiceWorkerRegistration
  ) => {
    const applicationServerKey = urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_KEY!
    );
    const options = {
      applicationServerKey,
      userVisibleOnly: true, // This ensures the delivery of notifications that are visible to the user, eliminating silent notifications. (Mandatory in Chrome, and optional in Firefox)
    };
    const subscription = await newRegistration.pushManager.subscribe(options);

    const supabase = createClient();

    const { error } = await supabase.from("push_subscriptions").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      subscription: JSON.stringify(subscription),
    });

    if (error) {
      toast.error(error.message);
    } else {
      qc.invalidateQueries({
        queryKey: ["notification"],
      });
    }
  };

  useEffect(() => {
    setNotificationPermission(Notification.permission);
  }, []);

  if (isFetching) {
    return null;
  }

  return (
    <div className=" hover:scale-110 cursor-pointer transition-all rounded-full p-2">
      {notificationPermission === "granted" && subscription != null ? (
        <BellRing onClick={removeNotification} />
      ) : (
        <BellOff onClick={showNotification} />
      )}
    </div>
  );
}
