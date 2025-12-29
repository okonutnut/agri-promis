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

export default function PermissionChecker() {
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [hasCheckedLocation, setHasCheckedLocation] = useState(false);
  const [hasCheckedNotification, setHasCheckedNotification] = useState(false);

  useEffect(() => {
    // Delay checks slightly to avoid showing dialogs immediately on page load
    const checkPermissions = () => {
      // Check location permission
      if (navigator.geolocation && !hasCheckedLocation) {
        // Check if we've already shown the dialog in this session
        const locationDialogShown = sessionStorage.getItem("locationDialogShown");
        
        // Try to get position with a very short timeout to check if permission is denied
        // Note: If permission hasn't been requested, this will show browser's native prompt
        // If permission was denied, it will fail immediately with PERMISSION_DENIED
        navigator.geolocation.getCurrentPosition(
          () => {
            // Permission is granted, no need to show dialog
            setHasCheckedLocation(true);
          },
          (error) => {
            setHasCheckedLocation(true);
            // Only show dialog if permission was explicitly denied
            if (error.code === error.PERMISSION_DENIED && !locationDialogShown) {
              setShowLocationDialog(true);
              sessionStorage.setItem("locationDialogShown", "true");
            }
            // For other errors (timeout, unavailable), we don't show dialog
            // as location might just be temporarily unavailable
          },
          { timeout: 100, maximumAge: 0 }
        );
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
  }, [hasCheckedLocation, hasCheckedNotification]);

  const handleLocationRequest = () => {
    setShowLocationDialog(false);
    if (navigator.geolocation) {
      // Request location permission - this will show the browser's native prompt
      // if permission hasn't been requested yet
      navigator.geolocation.getCurrentPosition(
        () => {
          // Permission granted
        },
        (error) => {
          // Permission denied or other error
          if (error.code === error.PERMISSION_DENIED) {
            // User denied permission, they can enable it in browser settings
            console.log("Location permission denied by user");
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
    
    // After location dialog closes, check if we should show notification dialog
    setTimeout(() => {
      if ("Notification" in window) {
        const permission = Notification.permission;
        const notificationDialogShown = sessionStorage.getItem("notificationDialogShown");
        if ((permission === "default" || permission === "denied") && !notificationDialogShown) {
          setShowNotificationDialog(true);
          sessionStorage.setItem("notificationDialogShown", "true");
        }
      }
    }, 500);
  };

  // Check notification permission after location check completes and location dialog is closed
  useEffect(() => {
    if (hasCheckedLocation && hasCheckedNotification && !showLocationDialog && !showNotificationDialog) {
      const notificationDialogShown = sessionStorage.getItem("notificationDialogShown");
      if (!notificationDialogShown && "Notification" in window) {
        const permission = Notification.permission;
        if (permission === "default" || permission === "denied") {
          setShowNotificationDialog(true);
          sessionStorage.setItem("notificationDialogShown", "true");
        }
      }
    }
  }, [hasCheckedLocation, hasCheckedNotification, showLocationDialog, showNotificationDialog]);

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
      <AlertDialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Location Access Required</AlertDialogTitle>
            <AlertDialogDescription>
              This app needs access to your location to provide location-based features.
              Please enable location access in your browser settings to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLocationRequest}>
              Enable Location
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notification Permission Dialog */}
      <AlertDialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notification Permission Required</AlertDialogTitle>
            <AlertDialogDescription>
              This app would like to send you notifications for important updates.
              Please enable notifications to stay informed.
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
