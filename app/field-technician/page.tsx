"use client";
import Navbar from "@/components/custom/navbar/navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export default function FieldTechnicianPage() {
  const [imageSrc, setImageSrc] = useState<string>("/placeholder.png");
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImageSrc(fileURL);
    } else {
      setImageSrc("/placeholder.png");
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocation({ latitude: null, longitude: null, error: null });

    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by this browser.",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
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
          latitude: null,
          longitude: null,
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

  return (
    <>
      <Navbar />
      <Card className="container mx-auto mt-10 p-5 space-y-4">
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
              <div className="bg-gray-50 p-3 rounded-md text-sm">
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
      </Card>
    </>
  );
}
