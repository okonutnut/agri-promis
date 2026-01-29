"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper function to detect mobile devices
const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  );
};

export default function PermissionChecker() {
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [hasCheckedLocation, setHasCheckedLocation] = useState(false);
  const [hasCheckedNotification, setHasCheckedNotification] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    // Delay checks slightly to avoid showing dialogs immediately on page load
    const checkPermissions = () => {
      // Check location permission
      if (navigator.geolocation && !hasCheckedLocation) {
        // Check if we've already shown the dialog in this session
        const locationDialogShown = sessionStorage.getItem(
          "locationDialogShown"
        );

        // On mobile devices, show dialog proactively if not shown before
        // This ensures users see instructions to enable GPS even if the check fails silently
        if (isMobile && !locationDialogShown) {
          // Show dialog immediately on mobile, then check if GPS is actually working
          setShowLocationDialog(true);
          sessionStorage.setItem("locationDialogShown", "true");
        }

        // Try to get position with a timeout to check if permission is denied or unavailable
        // Use longer timeout on mobile to detect GPS issues
        const timeout = isMobile ? 5000 : 2000;

        navigator.geolocation.getCurrentPosition(
          () => {
            // Permission is granted and location is available
            setHasCheckedLocation(true);
            // If dialog was shown proactively, close it now
            if (isMobile) {
              setShowLocationDialog(false);
            }
          },
          (error) => {
            setHasCheckedLocation(true);
            // On mobile, dialog is already shown proactively
            // On desktop, show dialog for explicit permission denial or unavailable
            if (!isMobile && !locationDialogShown) {
              if (
                error.code === error.PERMISSION_DENIED ||
                error.code === error.POSITION_UNAVAILABLE
              ) {
                setShowLocationDialog(true);
                sessionStorage.setItem("locationDialogShown", "true");
              }
            }
            // On mobile, if GPS is not working, dialog is already shown
            // If it was closed, we'll handle re-showing in handleLocationRequest
          },
          {
            timeout,
            maximumAge: 0,
            enableHighAccuracy: true,
          }
        );
      } else if (!navigator.geolocation && !hasCheckedLocation) {
        // Geolocation not supported
        setHasCheckedLocation(true);
        // Show dialog if geolocation is not supported
        const locationDialogShown = sessionStorage.getItem(
          "locationDialogShown"
        );
        if (!locationDialogShown) {
          setShowLocationDialog(true);
          sessionStorage.setItem("locationDialogShown", "true");
        }
      }

      // Check notification permission (but don't show dialog yet if location dialog might show)
      if ("Notification" in window && !hasCheckedNotification) {
        setHasCheckedNotification(true);
        // We'll show notification dialog after location dialog is handled
      }
    };

    // Small delay to avoid showing dialogs immediately on page load
    const timer = setTimeout(checkPermissions, 1000);
    return () => clearTimeout(timer);
  }, [hasCheckedLocation, hasCheckedNotification, isMobile]);

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      // Request location permission - this will show the browser's native prompt
      // if permission hasn't been requested yet
      // On mobile, this will also prompt to enable GPS if it's disabled
      navigator.geolocation.getCurrentPosition(
        () => {
          // Permission granted and GPS is working
          setShowLocationDialog(false);
          // Check notification permission after location is granted
          setTimeout(() => {
            if ("Notification" in window) {
              const permission = Notification.permission;
              const notificationDialogShown = sessionStorage.getItem(
                "notificationDialogShown"
              );
              if (
                (permission === "default" || permission === "denied") &&
                !notificationDialogShown
              ) {
                setShowNotificationDialog(true);
                sessionStorage.setItem("notificationDialogShown", "true");
              }
            }
          }, 500);
        },
        (error) => {
          // Permission denied or GPS unavailable
          // On mobile, if GPS is still not working, show dialog again after a delay
          // This gives user time to enable GPS in device settings
          if (isMobile) {
            if (
              error.code === error.PERMISSION_DENIED ||
              error.code === error.POSITION_UNAVAILABLE ||
              error.code === error.TIMEOUT
            ) {
              // Close dialog first, then re-check after user has time to enable GPS
              setShowLocationDialog(false);

              // Re-check after 3 seconds to see if user enabled GPS
              setTimeout(() => {
                navigator.geolocation.getCurrentPosition(
                  () => {
                    // GPS is now working, don't show dialog again
                  },
                  () => {
                    // Still not working, show dialog again to remind user
                    const locationDialogShown = sessionStorage.getItem(
                      "locationDialogShown"
                    );
                    if (!locationDialogShown) {
                      setShowLocationDialog(true);
                    }
                  },
                  { timeout: 5000, enableHighAccuracy: true }
                );
              }, 3000);
            } else {
              setShowLocationDialog(false);
            }
          } else {
            setShowLocationDialog(false);
          }

          // Check notification permission after handling location
          setTimeout(() => {
            if ("Notification" in window) {
              const permission = Notification.permission;
              const notificationDialogShown = sessionStorage.getItem(
                "notificationDialogShown"
              );
              if (
                (permission === "default" || permission === "denied") &&
                !notificationDialogShown
              ) {
                setShowNotificationDialog(true);
                sessionStorage.setItem("notificationDialogShown", "true");
              }
            }
          }, 500);
        },
        {
          enableHighAccuracy: true,
          timeout: isMobile ? 20000 : 15000, // Longer timeout for mobile GPS
          maximumAge: 0,
        }
      );
    } else {
      setShowLocationDialog(false);
    }
  };

  // Check notification permission after location check completes and location dialog is closed
  useEffect(() => {
    if (
      hasCheckedLocation &&
      hasCheckedNotification &&
      !showLocationDialog &&
      !showNotificationDialog
    ) {
      const notificationDialogShown = sessionStorage.getItem(
        "notificationDialogShown"
      );
      if (!notificationDialogShown && "Notification" in window) {
        const permission = Notification.permission;
        if (permission === "default" || permission === "denied") {
          setShowNotificationDialog(true);
          sessionStorage.setItem("notificationDialogShown", "true");
        }
      }
    }
  }, [
    hasCheckedLocation,
    hasCheckedNotification,
    showLocationDialog,
    showNotificationDialog,
  ]);

  const handleNotificationRequest = async () => {
    setShowNotificationDialog(false);
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // If notification component exists, it will handle subscription
        // We just need to close the dialog
      }
    }
  };

  return (
    <>
      {/* Location Permission Dialog */}
      <AlertDialog
        open={showLocationDialog}
        onOpenChange={(open) => {
          setShowLocationDialog(open);
          if (!open) {
            // When dialog is closed, check notification permission
            setTimeout(() => {
              if ("Notification" in window) {
                const permission = Notification.permission;
                const notificationDialogShown = sessionStorage.getItem(
                  "notificationDialogShown"
                );
                if (
                  (permission === "default" || permission === "denied") &&
                  !notificationDialogShown
                ) {
                  setShowNotificationDialog(true);
                  sessionStorage.setItem("notificationDialogShown", "true");
                }
              }
            }, 500);
          }
        }}
      >
        <AlertDialogContent className={isMobile ? "max-w-[95vw] mx-4" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle className={isMobile ? "text-lg" : ""}>
              {isMobile
                ? "🔒 GPS & Location Access Required"
                : "Location Access Required"}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <span>
                This app needs access to your location to provide location-based
                features.
              </span>
              {isMobile && (
                <div className="mt-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md space-y-3">
                  <span className="font-semibold text-sm text-yellow-900 dark:text-yellow-100">
                    ⚠️ Please enable GPS on your device:
                  </span>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                    <li>
                      <strong>Open your device Settings</strong> → Location/GPS
                    </li>
                    <li>
                      <strong>Turn ON Location Services</strong> (GPS)
                    </li>
                    <li>
                      <strong>Return to this app</strong> and tap &quot;Enable
                      GPS & Location&quot;
                    </li>
                    <li>
                      <strong>Allow location access</strong> when your browser
                      prompts you
                    </li>
                  </ol>
                  <span className="text-xs text-yellow-700 dark:text-yellow-300 italic">
                    Note: GPS must be enabled in device settings before the
                    browser can access your location.
                  </span>
                </div>
              )}
              {!isMobile && (
                <span className="text-sm mt-2">
                  Please enable location access in your browser settings to
                  continue.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter
            className={isMobile ? "flex-col gap-2 sm:flex-row" : ""}
          >
            <AlertDialogCancel className={isMobile ? "w-full sm:w-auto" : ""}>
              {isMobile ? "I'll Enable It Later" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLocationRequest}
              className={isMobile ? "w-full sm:w-auto" : ""}
            >
              {isMobile ? "Enable GPS & Location" : "Enable Location"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notification Permission Dialog */}
      <AlertDialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Notification Permission Required
            </AlertDialogTitle>
            <AlertDialogDescription>
              This app would like to send you notifications for important
              updates. Please enable notifications to stay informed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not Now</AlertDialogCancel>
            <AlertDialogAction onClick={handleNotificationRequest}>
              Enable Notifications
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
