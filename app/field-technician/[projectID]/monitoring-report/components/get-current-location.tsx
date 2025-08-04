"use client";

import { LocationData } from "@/components/interfaces";
import { Button } from "@/components/ui/button";
import { getLocationName } from "@/lib/utils";
import { MapPin, MapPinCheck, MapPinX } from "lucide-react";
import { useEffect, useState } from "react";

type GetCurrentLocationProps = {
  location: LocationData;
  setLocation: (location: LocationData) => void;
};
export default function GetCurrentLocation({
  location,
  setLocation,
}: GetCurrentLocationProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocation({
      latitude: undefined,
      longitude: undefined,
      locationName: undefined,
      error: undefined,
    });

    if (!navigator.geolocation) {
      setLocation({
        latitude: undefined,
        longitude: undefined,
        locationName: undefined,
        error: "Geolocation is not supported by this browser.",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Get location name
        const locationName = await getLocationName(lat, lng);

        setLocation({
          latitude: lat,
          longitude: lng,
          locationName: locationName,
          error: undefined,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setLocation({
          latitude: undefined,
          longitude: undefined,
          locationName: undefined,
          error: errorMessage,
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex justify-start items-center gap-2">
        <Button
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          variant="outline"
          className="h-10 w-10 rounded-full"
          size="sm"
        >
          {isGettingLocation ? (
            <MapPin />
          ) : location.error ? (
            <MapPinX />
          ) : location.locationName ? (
            <MapPinCheck />
          ) : (
            <MapPin />
          )}
        </Button>

        {location.error && (
          <p className="text-red-500 text-sm text-center">{location.error}</p>
        )}

        {location.latitude && location.longitude && (
          <small className="ms-2">Location Detected</small>
        )}
      </div>
    </div>
  );
}
