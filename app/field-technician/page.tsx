"use client";

import Navbar from "@/components/custom/navbar/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import UploadFieldReportForm from "./form/upload-field-report-form";
import { X } from "lucide-react";

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
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);

      try {
        // Compress the image if it's larger than 800KB
        const compressedFile =
          file.size > 800 * 1024 ? await compressImage(file, 800) : file;

        const fileURL = URL.createObjectURL(compressedFile);
        setImageSrc(fileURL);
        setImageFile(compressedFile);

        console.log(`Original size: ${(file.size / 1024).toFixed(2)}KB`);
        console.log(
          `Compressed size: ${(compressedFile.size / 1024).toFixed(2)}KB`
        );
      } catch (error) {
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
    <>
      <Navbar />
      <div className="container mx-auto mt-10 p-5 space-y-4">
        <div className="space-y-4">
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
                <X size={18} />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleInputChange}
                className="w-full"
                disabled={isCompressing}
              />
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
        <UploadFieldReportForm image_file={imageFile} location={location} />
      </div>
    </>
  );
}
