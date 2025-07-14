"use client";

import Navbar from "@/components/custom/navbar/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import UploadFieldReportForm from "./form/upload-field-report-form";

interface LocationData {
  latitude: number | undefined;
  longitude: number | undefined;
  locationName: string | undefined;
  error: string | undefined;
}

export default function FieldTechnicianPage() {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [location, setLocation] = useState<LocationData>({
    latitude: undefined,
    longitude: undefined,
    locationName: undefined,
    error: undefined,
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Function to get location name from coordinates
  const getLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      return (
        data.locality ||
        data.city ||
        data.principalSubdivision ||
        "Unknown location"
      );
    } catch (error) {
      console.error("Error getting location name:", error);
      return "Location name unavailable";
    }
  };

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

  // Auto-get location when component mounts
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImageSrc(fileURL);
      setImageFile(file); // Store the actual file
    } else {
      setImageSrc("");
      setImageFile(undefined); // Clear the file
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 p-5 space-y-4">
        <div className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleInputChange}
            className="w-full"
          />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                variant="outline"
                size="sm"
              >
                {isGettingLocation
                  ? "Getting Location..."
                  : "Get Current Location"}
              </Button>
            </div>

            {location.error && (
              <p className="text-red-500 text-sm">{location.error}</p>
            )}

            {location.latitude && location.longitude && (
              <div className="bg-gray-50 p-3 rounded-md text-sm space-y-1">
                {location.locationName && (
                  <p>
                    <strong>Location:</strong> {location.locationName}
                  </p>
                )}
                <p>
                  <strong>Latitude:</strong> {location.latitude.toFixed(6)}
                </p>
                <p>
                  <strong>Longitude:</strong> {location.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>

        {imageSrc && (
          <div className="flex justify-center">
            <Image
              src={imageSrc}
              alt="Preview"
              width={500}
              height={500}
              className="rounded-lg object-cover"
              onError={() => setImageSrc("/placeholder.png")}
            />
          </div>
        )}

        <UploadFieldReportForm image_file={imageFile} location={location} />
      </div>
    </>
  );
}
