import {
  SendPushNotificationToAllAction,
  SendPushNotificationToUserAction,
} from "@/app/actions/SubscriptionAction";
import { LocationData } from "@/components/interfaces";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import growthStages from "../data/growth-stages.json";
import { Stage } from "@/components/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sendNotification = async (message: string) => {
  await SendPushNotificationToAllAction(message);
};

export const sendNotificationToUser = async (
  userId: string,
  message: string
) => {
  await SendPushNotificationToUserAction(userId, message);
};

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

export const addOverlayToImage = (
  file: File,
  timestamp: string,
  location: LocationData,
  fullname: string,
  projectName: string
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

        ctx.drawImage(img, 0, 0);

        const minDimension = Math.min(img.width, img.height);
        const maxDimension = Math.max(img.width, img.height);

        // 🔹 Bigger font scaling (more readable)
        const baseFontSize = Math.min(minDimension / 15, maxDimension / 35);
        const fontSize = Math.max(28, Math.min(60, baseFontSize));

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
          const maxChars = Math.floor(img.width / (fontSize * 0.55));
          const words = location.locationName.split(" ");
          let currentLine = "Location: ";
          let locationLines: string[] = [];

          words.forEach((word) => {
            const testLine = currentLine + word + " ";
            if (testLine.length > maxChars) {
              locationLines.push(currentLine.trim());
              currentLine = word + " ";
            } else {
              currentLine = testLine;
            }
          });
          if (currentLine) locationLines.push(currentLine.trim());
          overlayLines.push(...locationLines);
        }

        overlayLines.push(`Project: ${projectName}`);
        overlayLines.push(`Captured by ${fullname}`);

        const padding = fontSize * 1.0;
        const lineHeight = fontSize * 1.5;
        const overlayHeight = overlayLines.length * lineHeight + padding * 2;

        const margin = Math.max(12, fontSize * 0.7);
        const overlayY = img.height - overlayHeight - margin;

        // Load and draw logo from public folder
        const logo = new window.Image();
        logo.onload = () => {
          // 🔹 Bigger auto-scale logo (8–10% of image height)
          const logoTargetHeight = Math.max(
            img.height * 0.1, // 10% of image height
            overlayHeight * 0.7
          );
          const logoTargetWidth = (logo.width / logo.height) * logoTargetHeight;

          const logoX = margin;
          const logoY = overlayY + padding;

          ctx.drawImage(logo, logoX, logoY, logoTargetWidth, logoTargetHeight);

          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.lineWidth = Math.max(3, fontSize / 8); // thicker outline

          overlayLines.forEach((line, index) => {
            const textX = logoX + logoTargetWidth + padding;
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
                resolve(file);
              }
            },
            "image/jpeg",
            0.9
          );
        };
        logo.onerror = () => reject(new Error("Failed to load logo"));
        logo.src = "/da-logo.png"; // from public folder
      } catch {
        resolve(file);
      }
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
      async (position) => {
        const { latitude, longitude } = position.coords;
        let locationName = "";

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          locationName = `${data.address.village || ""}, ${
            data.address.city || ""
          }, ${data.address.country || ""}`.replace(/^,\s|,\s$/g, "");
        } catch (error) {
          console.error("Error fetching from OpenStreetMap:", error);
          locationName = "Location unavailable";
        }

        resolve({
          latitude,
          longitude,
          locationName,
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

export async function getCurrentCoords(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  if (!("geolocation" in navigator)) {
    console.error("Geolocation is not supported by this browser.");
    return null;
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        reject(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

export function getPercentFromStages(
  stages: Stage[],
  currentValue: string,
  minPercent = 0,
  maxPercent = 100
): number {
  const idx = stages.findIndex((s) => s.value === currentValue);
  if (idx === -1) {
    return 0;
  }

  const total = stages.length;
  if (total === 1) {
    return maxPercent;
  }
  return (maxPercent - minPercent) / (total - 1);
  // console.log("Step Size:", step);
  // return minPercent + idx * step;
}
