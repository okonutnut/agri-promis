"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import UploadFieldReportForm from "./form/upload-field-report-form";
import { XCircle } from "lucide-react";
import { toast } from "sonner";
import UserPageLayout from "@/components/custom/layout/user-page-layout";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { get } from "http";

interface LocationData {
  latitude: number | undefined;
  longitude: number | undefined;
  locationName: string | undefined;
  error: string | undefined;
}

// Add this function before the component
const compressImage = (file: File, maxSizeKB: number = 800): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new window.Image();

    img.onload = () => {
      // Calculate new dimensions
      const maxWidth = 1200;
      const maxHeight = 1200;
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Start with high quality and reduce if needed
      let quality = 0.8;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size <= maxSizeKB * 1024) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else if (quality > 0.1) {
              quality -= 0.1;
              tryCompress();
            } else {
              // If still too large, resolve with current blob
              const compressedFile = new File([blob!], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            }
          },
          "image/jpeg",
          quality
        );
      };

      tryCompress();
    };

    img.src = URL.createObjectURL(file);
  });
};

export default function FieldTechnicianPage() {
  const [dateTimeCaptured, setDateTimeCaptured] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageFile, setImageFile] = useState<File>();
  const [location, setLocation] = useState<LocationData>({
    latitude: undefined,
    longitude: undefined,
    locationName: undefined,
    error: undefined,
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // Function to get location name from coordinates
  const getLocationName = async (lat: number, lng: number) => {
    try {
      // Using BigDataCloud API - no CORS issues
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();

      console.log("BigDataCloud data:", data); // For debugging

      const addressParts = [];

      // Street/Road
      if (data.localityInfo?.informative?.[0]?.name) {
        addressParts.push(data.localityInfo.informative[0].name);
      }

      // Barangay/Village
      if (data.localityInfo?.administrative?.[4]?.name) {
        addressParts.push(data.localityInfo.administrative[4].name);
      }

      // Municipality/City
      if (data.localityInfo?.administrative?.[3]?.name) {
        addressParts.push(data.localityInfo.administrative[3].name);
      } else if (data.city) {
        addressParts.push(data.city);
      } else if (data.locality) {
        addressParts.push(data.locality);
      }

      // Province/State
      if (data.localityInfo?.administrative?.[1]?.name) {
        addressParts.push(data.localityInfo.administrative[1].name);
      } else if (data.principalSubdivision) {
        addressParts.push(data.principalSubdivision);
      }

      // Country
      if (data.countryName) {
        addressParts.push(data.countryName);
      }

      return addressParts.length > 0
        ? addressParts.join(", ")
        : "Unknown location";
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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const now = new Date();
    now.setHours(now.getHours() + 8);
    setDateTimeCaptured(now.toISOString());
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);

      try {
        const compressedFile =
          file.size > 800 * 1024 ? await compressImage(file, 800) : file;

        const fileURL = URL.createObjectURL(compressedFile);
        setImageSrc(fileURL);
        setImageFile(compressedFile);
      } catch (error) {
        toast.error("Error compressing image. Please try again.");
        console.error("Error compressing image:", error);
        // Fallback to original file
        const fileURL = URL.createObjectURL(file);
        setImageSrc(fileURL);
        setImageFile(file);
      } finally {
        setIsCompressing(false);
      }
    } else {
      setImageSrc("");
      setImageFile(undefined);
    }
  };

  return (
    <UserPageLayout pageTitle="Submit Field Report">
      <div className="space-y-6">
        {imageSrc ? (
          <div className="flex justify-center relative">
            <Image
              src={imageSrc}
              alt="Preview"
              width={500}
              height={500}
              className="h-76 w-76 rounded-lg object-cover"
              onError={() => setImageSrc("/placeholder.png")}
            />
            <Button
              onClick={() => {
                setImageSrc("");
                setImageFile(undefined);
              }}
              variant={"ghost"}
              className="h-7 w-7 p-0 text-red-500 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
              style={{ zIndex: 10 }}
              aria-label="Remove image"
            >
              <XCircle size={18} />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Card className="h-76 w-76 mx-auto flex flex-col items-center justify-center border-2 border-dashed shadow-none transition-colors cursor-pointer relative overflow-hidden">
              <Input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isCompressing}
              />
              <div className="flex flex-col items-center justify-center space-y-3 ">
                <Camera size={48} className="text-gray-400" />
                <div className="text-center">
                  <p className="text-lg font-medium">Take Photo</p>
                  <p className="text-sm text-gray-400">Tap to open camera</p>
                </div>
              </div>
            </Card>
            {isCompressing && (
              <p className="text-blue-500 text-sm">Compressing image...</p>
            )}
          </div>
        )}

        {/* Show file size info */}
        {imageFile && (
          <p className="text-gray-500 text-xs text-center">
            File size: {(imageFile.size / 1024).toFixed(2)}KB
          </p>
        )}

        <div className="space-y-2">
          <div className="flex justify-center-safe items-center gap-2">
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
            <p className="text-red-500 text-sm text-center">{location.error}</p>
          )}

          {location.latitude && location.longitude && (
            <div className="flex flex-wrap justify-around p-3 rounded-md text-sm space-y-1">
              <p>
                <strong>Latitude:</strong> {location.latitude.toFixed(6)}
              </p>
              <p>
                <strong>Longitude:</strong> {location.longitude.toFixed(6)}
              </p>
              {location.locationName && (
                <p>
                  <strong>Location:</strong> {location.locationName}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <UploadFieldReportForm
        image_file={imageFile}
        date_time_captured={dateTimeCaptured}
        location={location}
      />
    </UserPageLayout>
  );
}
