import { toast } from "sonner";
import { ImageData } from "@/components/interfaces";

export const validateImages = (images: ImageData[]) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 3 * 1024 * 1024; // 3MB
  const maxTotalSize = 20 * 1024 * 1024; // 20MB

  if (!images || images.length === 0) {
    toast.error("At least one image is required");
    return false;
  }

  for (const img of images) {
    if (!allowedTypes.includes(img.file.type)) {
      toast.error("Please upload valid image files (JPEG, PNG, or WebP)");
      return false;
    }
    if (img.file.size > maxSize) {
      toast.error("Each image file must be less than 3MB");
      return false;
    }
  }

  const totalSize = images.reduce((sum, img) => sum + img.file.size, 0);
  if (totalSize > maxTotalSize) {
    toast.error("Total images size must be less than 20MB");
    return false;
  }

  return true;
};
