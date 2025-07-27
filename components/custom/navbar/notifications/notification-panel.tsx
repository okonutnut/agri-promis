import { subscribeUser, unsubscribeUser } from "@/app/actions";
import { SelectIfSubscribedAction } from "@/components/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { urlBase64ToUint8Array } from "@/lib/utils";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

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

  async function isSubscribed() {
    if (!subscription) return false;
    return await SelectIfSubscribedAction(subscription.endpoint);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser(subscription?.endpoint);
  }

  useEffect(() => {
    isSubscribed().then(setIsEnabled);
  }, [subscription, isSubscribed]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="relative rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-1 min-w-[200px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          Allow Notifications
          <Switch
            checked={isEnabled}
            onCheckedChange={() => {
              if (isEnabled) {
                unsubscribeFromPush();
              } else {
                subscribeToPush();
              }
              setIsEnabled(!isEnabled);
            }}
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isEnabled ? (
          <>
            <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
          </>
        ) : !isSupported ? (
          <DropdownMenuItem disabled>
            Notifications is not supported
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled>
            Notifications is disabled
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
