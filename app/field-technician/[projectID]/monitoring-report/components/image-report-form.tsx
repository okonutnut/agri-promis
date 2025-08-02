"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { XCircle, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { ImageData, LocationData } from "@/components/interfaces";
import { addOverlayToImage, compressImage } from "@/lib/utils";
import GetCurrentLocation from "./get-current-location";
import ImageModal from "@/components/ui/image-modal";
import { MonitoringReportType } from "@/components/types";
import ImageCarousel from "@/components/custom/images/image-carousel";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

type ImageCaptureFormProps = {
  isAddMode?: boolean;
  values?: MonitoringReportType | null;
  location: LocationData;
  setLocation: (location: LocationData) => void;
  images: ImageData[];
  setImages: React.Dispatch<React.SetStateAction<ImageData[]>>;
};
export default function ImageCaptureForm({
  isAddMode,
  values,
  location,
  setLocation,
  images,
  setImages,
}: ImageCaptureFormProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<ImageData | null>(
    null
  );

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setIsCompressing(true);

    try {
      const processedImages: ImageData[] = [];

      for (const file of files) {
        const dateTimeCaptured = new Date().toLocaleDateString("en-PH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        const overlayedFile = await addOverlayToImage(
          file,
          dateTimeCaptured,
          location
        );

        const compressedFile =
          overlayedFile.size > 800 * 1024
            ? await compressImage(overlayedFile, 800)
            : overlayedFile;

        const fileURL = URL.createObjectURL(compressedFile);
        const imageData: ImageData = {
          id: `${Date.now()}-${Math.random()}`,
          src: fileURL,
          file: compressedFile,
          dateTimeCaptured: dateTimeCaptured,
        };

        processedImages.push(imageData);
      }

      setImages((prev) => [...prev, ...processedImages]);
    } catch (error) {
      toast.error("Error processing images. Please try again.");
      console.error("Error processing images:", error);
    } finally {
      setIsCompressing(false);
      e.target.value = "";
    }
  };

  const removeImage = (imageId: string) => {
    setImages((prev: ImageData[]) => {
      const imageToRemove = prev.find((img) => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.src);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  };

  const openFullScreen = (image: ImageData) => {
    setFullScreenImage(image);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };

  return (
    <>
      {values?.created_at && (
        <span className="italic text-xs text-muted-foreground mx-2">
          Date Submitted: {format(new Date(values.created_at), "PPp")}
        </span>
      )}
      <div className="space-y-4 m-2">
        {isAddMode ? (
          <>
            <GetCurrentLocation location={location} setLocation={setLocation} />
            {/* Image Gallery with Camera Trigger */}
            <div className="space-y-2">
              <div className="flex gap-4 overflow-x-auto pb-4">
                {/* Camera Trigger Card */}
                <div
                  className={`${
                    images.length === 0
                      ? "w-full"
                      : "min-w-[128px] max-w-[200px]"
                  } h-40`}
                >
                  <Card className="h-full w-full flex flex-col items-center justify-center border-2 border-dashed shadow-none transition-colors cursor-pointer relative overflow-hidden">
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={handleInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={isCompressing}
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Camera size={36} className="text-gray-400" />
                      <p className="text-sm font-medium text-center">
                        {images.length === 0
                          ? "Take Photos to Start"
                          : "Take Photos"}
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Uploaded Images */}
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative min-w-[128px] max-w-[200px] group"
                  >
                    <div
                      className="relative cursor-pointer h-40"
                      onClick={() => openFullScreen(image)}
                    >
                      <Image
                        src={image.src}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="h-full w-full rounded-sm object-cover transition-opacity group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 bg-black/5 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-sm flex items-center justify-center">
                        <ZoomIn
                          size={24}
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 absolute top-1 right-1 bg-white/80 hover:bg-white/90 rounded-full z-10"
                      aria-label="Remove image"
                    >
                      <XCircle size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              {isCompressing && (
                <p className="text-blue-500 text-sm text-center">
                  Processing images and adding overlay...
                </p>
              )}
            </div>
            <ImageModal
              isOpen={!!fullScreenImage}
              imageSrc={fullScreenImage?.src || ""}
              imageAlt="Captured image preview"
              onClose={closeFullScreen}
            />
          </>
        ) : (
          <ImageCarousel images={values?.photo_url ?? []} />
        )}
      </div>
    </>
  );
}
