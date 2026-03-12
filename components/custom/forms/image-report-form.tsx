"use client";

import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { Camera, Images, XCircle, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { ImageData } from "@/components/interfaces";
import {
  addOverlayToImage,
  compressImage,
  getLongtitudeLatitudeFromGPS,
} from "@/lib/utils";
import { useParams } from "next/navigation";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectUserProfileAction } from "@/app/actions/UserProfileAction";
import { SelectProjectDetailsByProjectLocationIDAction } from "@/app/actions/ProjectAction";
import { SelectProgramByIdAction } from "@/app/actions/ProgramAction";
import { LocationData } from "@/components/interfaces";

const ImageModal = dynamic(() => import("@/components/ui/image-modal"), {
  ssr: false,
});

const ImageCarousel = dynamic(
  () => import("@/components/custom/images/image-carousel"),
  {
    ssr: false,
  },
);

type ImageCaptureFormProps = {
  isAddMode?: boolean;
  values?: { photo_url?: string[] } | null;
  images: ImageData[];
  setImages: React.Dispatch<React.SetStateAction<ImageData[]>>;
  enableOverlay?: boolean;
  projectID?: string;
  programID?: string;
};

export default function ImageCaptureForm({
  isAddMode,
  values,
  images,
  setImages,
  enableOverlay = true,
  projectID: propProjectID,
  programID: propProgramID,
}: ImageCaptureFormProps) {
  const params = useParams();
  const projectID =
    propProjectID ||
    (Array.isArray(params?.projectID)
      ? params.projectID[0]
      : (params?.projectID as string));
  const programID =
    propProgramID ||
    (Array.isArray(params?.programID)
      ? params.programID[0]
      : (params?.programID as string));

  const [isCompressing, setIsCompressing] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<ImageData | null>(
    null,
  );

  const { data: userProfile } = useRealtimeQuery({
    queryKey: ["user_profile"],
    queryFn: SelectUserProfileAction,
    table: "user_profile",
  });

  const { data: project, isLoading: isProjectLoading } = useRealtimeQuery({
    queryKey: ["project_details", projectID],
    queryFn: async () => {
      if (!projectID || !enableOverlay) return null;
      return SelectProjectDetailsByProjectLocationIDAction(projectID);
    },
    table: "projects",
  });

  const { data: program, isLoading: isProgramLoading } = useRealtimeQuery({
    queryKey: ["program_details", programID],
    queryFn: async () => {
      if (!programID || !enableOverlay || projectID) return null;
      return SelectProgramByIdAction(programID);
    },
    table: "programs",
  });

  const isLoading = enableOverlay && (isProjectLoading || isProgramLoading);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setIsCompressing(true);

    try {
      // Get GPS location once before processing all images
      let locationData: LocationData | null = null;
      if (enableOverlay && userProfile && (project || program)) {
        try {
          locationData = await getLongtitudeLatitudeFromGPS();
          if (locationData.error) {
            toast.warning(
              `Location unavailable: ${locationData.error}. Images will be saved without location data.`,
            );
          }
        } catch (error) {
          console.error("Error getting GPS location:", error);
          toast.warning(
            "Failed to get location. Images will be saved without location data.",
          );
        }
      }

      const processedImages: ImageData[] = [];

      for (const file of files) {
        // Use ISO string for proper timestamp parsing
        const dateTimeCaptured = new Date().toISOString();
        const dateTimeDisplay = new Date().toLocaleString("en-PH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        let processedFile = file;

        if (enableOverlay && userProfile && (project || program)) {
          // Use locationData if available, otherwise create empty location
          const location = locationData || {
            latitude: undefined,
            longitude: undefined,
            locationName: undefined,
            error: undefined,
          };

          // Use project name if available, otherwise use program name
          const displayName =
            project?.projects?.project_name ||
            program?.program_name ||
            "Unknown";

          const overlayedFile = await addOverlayToImage(
            file,
            dateTimeCaptured,
            location,
            userProfile?.fullname || "Unknown User",
            displayName,
          );

          processedFile =
            overlayedFile.size > 800 * 1024
              ? await compressImage(overlayedFile, 800)
              : overlayedFile;
        }

        const fileURL = URL.createObjectURL(processedFile);
        const imageData: ImageData = {
          id: `${Date.now()}-${Math.random()}`,
          src: fileURL,
          file: processedFile,
          dateTimeCaptured: dateTimeDisplay,
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setIsCompressing(true);

    try {
      const processedImages: ImageData[] = [];

      for (const file of files) {
        const fileURL = URL.createObjectURL(file);
        const dateTimeCaptured = new Date().toLocaleDateString("en-PH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        const imageData: ImageData = {
          id: `${Date.now()}-${Math.random()}`,
          src: fileURL,
          file: file,
          dateTimeCaptured: dateTimeCaptured,
        };

        processedImages.push(imageData);
      }

      setImages((prev) => [...prev, ...processedImages]);
    } catch (error) {
      toast.error("Error uploading images. Please try again.");
      console.error("Error uploading images:", error);
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
      <div className="space-y-4 m-2">
        {isAddMode ? (
          <>
            <div className="space-y-2">
              <div className="flex gap-4 justify-start overflow-x-auto pb-4">
                <div className="min-w-32 max-w-50 h-50">
                  <Card
                    className={`h-full w-full flex flex-col items-center justify-center border-2 border-dashed shadow-none transition-colors cursor-pointer relative overflow-hidden ${
                      isLoading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={handleInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={isCompressing || isLoading}
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Camera className="text-gray-400" />
                      <p className="text-xs text-gray-500">
                        Capture via Camera
                      </p>
                    </div>
                  </Card>
                </div>

                <div className="min-w-32 max-w-50 h-50">
                  <Card
                    className={`h-full w-full flex flex-col items-center justify-center border-2 border-dashed shadow-none transition-colors cursor-pointer relative overflow-hidden ${
                      isLoading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={isCompressing || isLoading}
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Images className="text-gray-400" />
                      <p className="text-xs text-gray-500">
                        Upload from Gallery
                      </p>
                    </div>
                  </Card>
                </div>

                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative min-w-32 max-w-50 group"
                  >
                    <div
                      className="relative cursor-pointer h-50"
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
                  {enableOverlay
                    ? "Processing images and adding overlay..."
                    : "Processing images..."}
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
