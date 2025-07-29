import { LocationData } from "@/components/interfaces";
import { getClientIpFromHeaders } from "@/utils/getClientIpFromHeaders";
import { createClient } from "@/utils/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const compressImage = (
  file: File,
  maxSizeKB: number = 800
): Promise<File> => {
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

export const getLocationName = async (lat: number, lng: number) => {
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

export const addOverlayToImage = (
  file: File,
  timestamp: string,
  location: LocationData
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the original image first
        ctx.drawImage(img, 0, 0);

        // Calculate font size based on both width and height for better scaling
        const minDimension = Math.min(img.width, img.height);
        const maxDimension = Math.max(img.width, img.height);

        // Use a combination of both dimensions for more balanced scaling
        const baseFontSize = Math.min(minDimension / 25, maxDimension / 60);
        const fontSize = Math.max(18, Math.min(32, baseFontSize));

        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        // Format timestamp
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();

        // Prepare overlay text
        const overlayLines = [`${formattedDate} ${formattedTime}`];

        // Add location info if available
        if (location.latitude && location.longitude) {
          overlayLines.push(
            `Lat: ${location.latitude.toFixed(
              6
            )}, Long: ${location.longitude.toFixed(6)}`
          );
        }

        if (location.locationName) {
          // Adjust max characters based on image width and font size
          const maxChars = Math.floor(img.width / (fontSize * 0.6));
          const locationText =
            location.locationName.length > maxChars
              ? location.locationName.substring(0, maxChars) + "..."
              : location.locationName;
          overlayLines.push(`Location: ${locationText}`);
        }

        // Calculate overlay dimensions with responsive scaling
        const padding = fontSize * 0.8;
        const lineHeight = fontSize * 1.4;
        const overlayHeight = overlayLines.length * lineHeight + padding * 2;

        // Calculate max text width
        const textWidths = overlayLines.map(
          (line) => ctx.measureText(line).width
        );
        const maxTextWidth = Math.max(...textWidths);
        const overlayWidth = maxTextWidth + padding * 2;

        // Position overlay at bottom-left with responsive margins
        const margin = Math.max(10, fontSize * 0.6);
        const overlayX = margin;
        const overlayY = img.height - overlayHeight - margin;

        // Draw semi-transparent background with rounded corners
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(overlayX, overlayY, overlayWidth, overlayHeight);

        // Draw text with improved styling
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = Math.max(1, fontSize / 16);

        overlayLines.forEach((line, index) => {
          const textX = overlayX + padding;
          const textY = overlayY + padding + index * lineHeight;

          // Add stroke for better readability
          ctx.strokeText(line, textX, textY);
          ctx.fillText(line, textX, textY);
        });

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const overlayedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(overlayedFile);
            } else {
              // If blob creation fails, return original file
              console.warn("Blob creation failed, using original file");
              resolve(file);
            }
          },
          "image/jpeg",
          0.9
        );
      } catch (error) {
        console.error("Error in overlay creation:", error);
        resolve(file); // Return original file on error
      }
    };

    img.onerror = () => {
      console.error("Image load error in overlay function");
      resolve(file); // Return original file on error
    };

    img.src = URL.createObjectURL(file);
  });
};

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function getLongtitudeLatitudeFromGPS(): Promise<LocationData> {
  if (!navigator.geolocation) {
    return {
      latitude: 0,
      longitude: 0,
      locationName: "",
      error: "Geolocation is not supported by this browser.",
    };
  }

  return new Promise<LocationData>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({
          latitude,
          longitude,
          locationName: "",
          error: undefined,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        resolve({
          latitude: 0,
          longitude: 0,
          locationName: "",
          error: error.message,
        });
      }
    );
  });
}

export async function updateUserLocation() {
  const supabase = createClient();
  const locationData = await getLongtitudeLatitudeFromGPS();
  const ipAddress = await getClientIpFromHeaders();
  const { data: user } = await supabase.auth.getUser();

  if (!user?.user?.id) {
    return;
  }

  return await supabase.from("user_session").upsert(
    {
      user_id: user?.user?.id,
      longitude: locationData.longitude,
      latitude: locationData.latitude,
      ip_address: ipAddress == "::1" ? "localhost" : ipAddress,
    },
    { onConflict: "user_id" }
  );
}
