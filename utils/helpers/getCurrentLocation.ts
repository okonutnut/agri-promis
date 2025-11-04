"use client";

import { useCallback, useEffect, useState } from "react";

type LatLng = { lat: number; lng: number } | null;

/**
 * useCurrentLocation
 * A small reusable hook that returns the user's current coords (if available),
 * a loading state, an error message, and a refresh function to re-request location.
 *
 * Usage:
 * const { location, loading, error, refresh } = useCurrentLocation();
 */
export default function useCurrentLocation() {
  const [location, setLocation] = useState<LatLng>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [rawError, setRawError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getLocation = useCallback(() => {
    // Helper: try an IP-based geolocation service as a fallback
    const fetchIpLocation = async (): Promise<LatLng> => {
      try {
        // ipapi.co is a lightweight public service (rate-limited). It returns latitude/longitude fields.
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error(`IP geolocation failed: ${res.status}`);
        const data = await res.json();
        const lat = parseFloat(data.latitude ?? data.lat ?? "");
        const lng = parseFloat(data.longitude ?? data.lon ?? "");
        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
      } catch (e) {
        console.error("IP geolocation fallback failed:", e);
      }
      return null;
    };

    // Guard for SSR / Node runtime where navigator is undefined
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      // Try IP fallback before failing completely
      setLoading(true);
      (async () => {
        const ipLoc = await fetchIpLocation();
        if (ipLoc) {
          setLocation(ipLoc);
          setError(null);
          setErrorCode(null);
          setRawError(null);
        } else {
          setError("Geolocation is not supported by this browser and IP-based lookup failed.");
          setLocation(null);
        }
        setLoading(false);
      })();
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError(null);
        setErrorCode(null);
        setRawError(null);
        setLoading(false);
      },
      (err) => {
        // Provide clearer, mapped messages for common PositionError codes
        const code = (err as any)?.code;
        const message = (err as any)?.message || "Unable to retrieve location.";
        let friendly = message;

        // Standard PositionError codes: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
        if (code === 1) {
          friendly = "Location access was denied. Please allow location permissions in your browser settings.";
          // Do not fallback on explicit denial
          setError(friendly);
          setErrorCode(1);
          setRawError(err);
          setLocation(null);
          setLoading(false);
          return;
        } else if (code === 2) {
          friendly = "Position unavailable. Attempting IP-based lookup as a fallback...";
        } else if (code === 3) {
          friendly = "Location request timed out. Attempting IP-based lookup as a fallback...";
        }

        // Try IP-based fallback for transient/unavailable errors
        (async () => {
          setError(friendly);
          setErrorCode(typeof code === "number" ? code : null);
          setRawError(err);
          const ipLoc = await fetchIpLocation();
          if (ipLoc) {
            // Informational: we replace the error with null since we have a location (approximate)
            setLocation(ipLoc);
            setError(null);
            setErrorCode(null);
            setRawError(null);
          } else {
            // Keep the friendly message if fallback failed
            setLocation(null);
          }
          setLoading(false);
        })();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    // Run immediately on mount and then every 5 minutes
    getLocation();
    const interval = window.setInterval(getLocation, 5 * 60 * 1000); // 300000 ms

    return () => {
      window.clearInterval(interval);
    };
  }, [getLocation]);

  return { location, loading, error, errorCode, rawError, refresh: getLocation };
}
