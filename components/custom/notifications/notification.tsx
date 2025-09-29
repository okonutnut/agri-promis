"use client";

import {
  DeleteSubscrptionEndpoint,
  InsertSubscribeEndPoint,
} from "@/app/actions/SubscriptionAction";
import { urlBase64ToUint8Array } from "@/lib/utils";
import { BellOff, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NotificationRequest() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    "granted" | "denied" | "default"
  >("default");
  const [isLoading, setIsLoading] = useState(false);

  const showNotificationRequest = async () => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support notifications.");
      return;
    }

    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await subscribeUser();
      } else if (permission === "denied") {
        toast.error("You have denied notification permissions.");
      }
    } catch {
      toast.error("Error requesting notification permission.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeNotification = async () => {
    setIsLoading(true);
    try {
      setNotificationPermission("denied");
      const isSuccess = await DeleteSubscrptionEndpoint();
      if (isSuccess) {
        setIsEnabled(false);
        toast("You have successfully unsubscribed from notifications.");
      } else {
        toast.error("Cannot unsubscribe from notifications.");
      }
    } catch {
      toast.error("Error unsubscribing from notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  async function subscribeUser() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          toast.error(
            "No service worker registered. Notifications cannot be enabled."
          );
          return;
        }
        await generateSubscribeEndPoint(registration);
      } catch {
        await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        toast.error("Unable to subscribe to notifications.");
      }
    }
  }

  async function generateSubscribeEndPoint(
    newRegistration: ServiceWorkerRegistration
  ) {
    setIsLoading(true);
    try {
      const applicationServerKey = urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      );
      const options = { applicationServerKey, userVisibleOnly: true };
      const subscription = await newRegistration.pushManager.subscribe(options);
      const isInserted = await InsertSubscribeEndPoint(
        JSON.stringify(subscription)
      );

      if (isInserted) {
        setIsEnabled(true);
        toast.success("You have successfully subscribed to notifications.");
      } else {
        toast.error("Cannot subscribe to notifications.");
      }
    } catch {
      toast.error("Error subscribing to notifications.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setNotificationPermission(Notification.permission);
      const updatePermission = () =>
        setNotificationPermission(Notification.permission);
      document.addEventListener("visibilitychange", updatePermission);
      return () =>
        document.removeEventListener("visibilitychange", updatePermission);
    }
  }, []);

  return (
    <div className="hover:scale-110 cursor-pointer transition-all">
      {notificationPermission === "granted" || isEnabled ? (
        <BellRing
          onClick={() => {
            if (!isLoading) removeNotification();
          }}
          className={isLoading ? "opacity-50 pointer-events-none" : ""}
        />
      ) : (
        <BellOff
          onClick={() => {
            if (!isLoading) showNotificationRequest();
          }}
          className={isLoading ? "opacity-50 pointer-events-none" : ""}
        />
      )}
    </div>
  );
}
