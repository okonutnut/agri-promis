"use client";

import { subscribeUser, unsubscribeUser } from "@/app/actions";
import { SelectIfSubscribedAction } from "@/components/actions";
import { Button } from "@/components/ui/button";
import { urlBase64ToUint8Array } from "@/lib/utils";
import { BellOff, BellRing } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function NotificationsPanel() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  const isSubscribed = useCallback(async () => {
    if (!subscription) return false;
    return await SelectIfSubscribedAction(subscription.endpoint);
  }, [subscription]);

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser(subscription?.endpoint);
  }

  useEffect(() => {
    isSubscribed()
      .then(setIsEnabled)
      .catch((error) => {
        console.error("Error checking subscription status:", error);
        toast.error("Failed to check subscription status.");
        setIsEnabled(false);
      });
  }, [isSubscribed]);

  return (
    <Button
      variant={"ghost"}
      className="relative rounded-full"
      onClick={() => {
        if (!isSupported) {
          toast.error("Push notifications are not supported in this browser.");
          return;
        }
        if (isEnabled) {
          unsubscribeFromPush().then(() => {
            setIsEnabled(false);
            toast("Unsubscribed from notifications.");
          });
        } else {
          subscribeToPush().then(() => {
            setIsEnabled(true);
            toast("Subscribed to notifications.");
          });
        }
      }}
    >
      {isEnabled ? (
        <BellRing className="h-5 w-5" />
      ) : (
        <BellOff className="h-5 w-5" />
      )}
    </Button>
  );
}
