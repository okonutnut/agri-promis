
import { LocationData } from "@/components/interfaces";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Stage } from "@/components/types";

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
        const aspectRatio = img.width / img.height;

        // Better font size calculation based on aspect ratio
        // For portrait images, use height-based calculation
        // For landscape images, use width-based calculation
        let baseFontSize: number;
        if (aspectRatio < 1) {
          // Portrait: base on height
          baseFontSize = minDimension / 20;
        } else if (aspectRatio > 1.5) {
          // Wide landscape: base on width
          baseFontSize = img.width / 40;
        } else {
          // Square or moderate landscape: use minimum dimension
          baseFontSize = minDimension / 18;
        }

        // Clamp font size to reasonable bounds
        const fontSize = Math.max(16, Math.min(32, baseFontSize));

        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        const overlayLines: string[] = [`${formattedDate} ${formattedTime}`];

        if (location.latitude && location.longitude) {
          overlayLines.push(
            `Lat: ${location.latitude.toFixed(6)}, Long: ${location.longitude.toFixed(6)}`
          );
        }

        // Better text wrapping using actual text measurement
        if (location.locationName) {
          const maxTextWidth = img.width * 0.6; // Use 60% of image width for text area
          const words = location.locationName.split(" ");
          let currentLine = "Location: ";
          const locationLines: string[] = [];

          words.forEach((word) => {
            const testLine = currentLine + word + " ";
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxTextWidth && currentLine !== "Location: ") {
              locationLines.push(currentLine.trim());
              currentLine = word + " ";
            } else {
              currentLine = testLine;
            }
          });
          if (currentLine.trim() !== "Location:") {
            locationLines.push(currentLine.trim());
          }
          overlayLines.push(...locationLines);
        }

        // Wrap project name and fullname if needed
        const projectText = `Project: ${projectName}`;
        const projectMetrics = ctx.measureText(projectText);
        const maxTextWidth = img.width * 0.6;
        
        if (projectMetrics.width > maxTextWidth) {
          // Split project name if too long
          const words = projectName.split(" ");
          let currentLine = "Project: ";
          const projectLines: string[] = [];
          
          words.forEach((word) => {
            const testLine = currentLine + word + " ";
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxTextWidth && currentLine !== "Project: ") {
              projectLines.push(currentLine.trim());
              currentLine = word + " ";
            } else {
              currentLine = testLine;
            }
          });
          if (currentLine.trim() !== "Project:") {
            projectLines.push(currentLine.trim());
          }
          overlayLines.push(...projectLines);
        } else {
          overlayLines.push(projectText);
        }

        const capturedByText = `Captured by ${fullname}`;
        const capturedByMetrics = ctx.measureText(capturedByText);
        
        if (capturedByMetrics.width > maxTextWidth) {
          // Split if too long
          const words = fullname.split(" ");
          let currentLine = "Captured by ";
          const nameLines: string[] = [];
          
          words.forEach((word) => {
            const testLine = currentLine + word + " ";
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxTextWidth && currentLine !== "Captured by ") {
              nameLines.push(currentLine.trim());
              currentLine = word + " ";
            } else {
              currentLine = testLine;
            }
          });
          if (currentLine.trim() !== "Captured by") {
            nameLines.push(currentLine.trim());
          }
          overlayLines.push(...nameLines);
        } else {
          overlayLines.push(capturedByText);
        }

        const padding = fontSize * 0.8;
        const lineHeight = fontSize * 1.3;
        const overlayHeight = overlayLines.length * lineHeight + padding * 2;

        // Ensure overlay doesn't go outside image bounds
        const margin = Math.max(10, fontSize * 0.5);
        let overlayY = img.height - overlayHeight - margin;
        
        // If overlay would go outside bounds, adjust it
        if (overlayY < margin) {
          overlayY = margin;
        }

        // Load and draw logo from public folder
        const logo = new window.Image();
        logo.onload = () => {
          // Scale logo to fit within overlay area
          const logoTargetHeight = Math.min(
            overlayHeight * 0.6,
            img.height * 0.08 // Max 8% of image height
          );
          const logoTargetWidth = (logo.width / logo.height) * logoTargetHeight;

          const logoX = margin;
          const logoY = overlayY + padding;

          // Ensure logo doesn't go outside bounds
          if (logoX + logoTargetWidth > img.width - margin) {
            // Scale down logo if needed
            const maxLogoWidth = img.width - margin * 2;
            const scale = maxLogoWidth / logoTargetWidth;
            const adjustedLogoWidth = logoTargetWidth * scale;
            const adjustedLogoHeight = logoTargetHeight * scale;
            ctx.drawImage(logo, logoX, logoY, adjustedLogoWidth, adjustedLogoHeight);
          } else {
            ctx.drawImage(logo, logoX, logoY, logoTargetWidth, logoTargetHeight);
          }

          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.lineWidth = Math.max(2, fontSize / 10);

          // Calculate text area width (accounting for logo and padding)
          const textAreaX = logoX + logoTargetWidth + padding;
          const textAreaWidth = img.width - textAreaX - margin;

          overlayLines.forEach((line, index) => {
            const textY = overlayY + padding + index * lineHeight;
            
            // Measure text and truncate if it exceeds available width
            let displayLine = line;
            let textMetrics = ctx.measureText(displayLine);
            
            if (textMetrics.width > textAreaWidth) {
              // Truncate text with ellipsis
              while (textMetrics.width > textAreaWidth - ctx.measureText("...").width && displayLine.length > 0) {
                displayLine = displayLine.slice(0, -1);
                textMetrics = ctx.measureText(displayLine + "...");
              }
              displayLine = displayLine + "...";
            }
            
            // Ensure text doesn't go outside image bounds
            const finalTextX = Math.min(textAreaX, img.width - margin - textMetrics.width);
            
            ctx.strokeText(displayLine, finalTextX, textY);
            ctx.fillText(displayLine, finalTextX, textY);
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
    // Set a timeout to prevent hanging indefinitely
    const timeoutId = setTimeout(() => {
      resolve({
        latitude: 0,
        longitude: 0,
        locationName: "",
        error: "Geolocation request timed out. Please ensure location permissions are granted.",
      });
    }, 10000); // 10 second timeout

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;
        let locationName = "";

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'AgriPromis/1.0'
              }
            }
          );
          const data = await response.json();
          locationName = `${data.address?.village || ""}, ${
            data.address?.city || ""
          }, ${data.address?.country || ""}`.replace(/^,\s|,\s$/g, "");
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
      (error: GeolocationPositionError) => {
        clearTimeout(timeoutId);
        
        // Handle different types of geolocation errors
        let errorMessage = "Unable to get location";
        
        if (error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable. Please check your device's location services.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
            default:
              errorMessage = error.message || "An unknown error occurred while getting location.";
              break;
          }
        }
        
        console.error("Geolocation error:", {
          code: error?.code,
          message: error?.message,
          error: error
        });
        
        resolve({
          latitude: 0,
          longitude: 0,
          locationName: "",
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Accept cached position up to 1 minute old
      }
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

  // If only one stage, return maxPercent.
  if (total === 1) return maxPercent;

  // First stage -> minPercent (usually 0%). Last stage -> maxPercent.
  // Intermediate stages are evenly spaced between min and max.
  const step = (maxPercent - minPercent) / (total - 1);
  return Math.round(minPercent + idx * step);
}
