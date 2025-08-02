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

export const getLocationName = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();

    // Extract barangay (village), municipality (city/town), and province (state)
    const barangay = data.address.village || data.address.neighbourhood;
    const municipality = data.address.city || data.address.town;
    const province = data.address.state;
    const country = data.address.country;

    return [barangay, municipality, province, country]
      .filter(Boolean) // Remove undefined/null
      .join(", ");
  } catch (error) {
    console.error("Error fetching from OpenStreetMap:", error);
    return "Location unavailable";
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
    const logo = new window.Image();

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    Promise.all([
      new Promise<void>((res) => {
        img.onload = () => res();
        img.src = URL.createObjectURL(file);
      }),
      new Promise<void>((res) => {
        logo.onload = () => res();
        logo.src = "/logo.png";
      }),
    ])
      .then(() => {
        try {
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          // Increased size factors
          const minDimension = Math.min(img.width, img.height);
          const maxDimension = Math.max(img.width, img.height);
          const baseFontSize = Math.min(minDimension / 20, maxDimension / 45); // Increased from 25/60
          const fontSize = Math.max(22, Math.min(38, baseFontSize)); // Increased from 18/32

          ctx.font = `bold ${fontSize}px Arial, sans-serif`;
          ctx.textAlign = "left";
          ctx.textBaseline = "top";

          const date = new Date(timestamp);
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString();
          const overlayLines = [`${formattedDate} ${formattedTime}`];

          if (location.latitude && location.longitude) {
            overlayLines.push(
              `Lat: ${location.latitude.toFixed(
                6
              )}, Long: ${location.longitude.toFixed(6)}`
            );
          }

          if (location.locationName) {
            const maxChars = Math.floor(img.width / (fontSize * 0.55)); // Adjusted for larger text
            const locationText =
              location.locationName.length > maxChars
                ? location.locationName.substring(0, maxChars) + "..."
                : location.locationName;
            overlayLines.push(`Location: ${locationText}`);
          }

          // Increased padding and dimensions
          const padding = fontSize * 1.0; // Increased from 0.8
          const lineHeight = fontSize * 1.5; // Increased from 1.4
          const overlayHeight = overlayLines.length * lineHeight + padding * 2;
          const textWidths = overlayLines.map(
            (line) => ctx.measureText(line).width
          );
          const maxTextWidth = Math.max(...textWidths);

          const logoHeight = overlayHeight - padding * 1.8; // Slightly adjusted
          const logoWidth = (logo.width / logo.height) * logoHeight;

          const margin = Math.max(12, fontSize * 0.7); // Increased from 10/0.6
          const overlayY = img.height - overlayHeight - margin;
          const totalWidth = logoWidth + maxTextWidth + padding * 4;

          ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Slightly more opaque
          ctx.fillRect(margin, overlayY, totalWidth, overlayHeight);

          ctx.drawImage(
            logo,
            margin + padding,
            overlayY + padding,
            logoWidth,
            logoHeight
          );

          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.lineWidth = Math.max(1.2, fontSize / 14); // Increased from 1/16

          overlayLines.forEach((line, index) => {
            const textX = margin + logoWidth + padding * 2;
            const textY = overlayY + padding + index * lineHeight;
            ctx.strokeText(line, textX, textY);
            ctx.fillText(line, textX, textY);
          });

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const overlayedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(overlayedFile);
              } else {
                console.warn("Blob creation failed, using original file");
                resolve(file);
              }
            },
            "image/jpeg",
            0.9
          );
        } catch (error) {
          console.error("Error in overlay creation:", error);
          resolve(file);
        }
      })
      .catch(() => {
        console.error("Error loading images");
        resolve(file);
      });
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
