import FormTextarea from "@/components/custom/input/form-textarea";
import { useInsertMonitoringReportHook } from "@/components/hooks";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const fieldReportSchema = z.object({
  status_note: z
    .string()
    .min(1, "Status note is required")
    .min(5, "Status note must be at least 5 characters")
    .max(500, "Status note must not exceed 500 characters"),
});

type FieldReportFormData = z.infer<typeof fieldReportSchema>;

interface ImageData {
  id: string;
  src: string;
  file: File;
  dateTimeCaptured: string;
}

interface UploadFieldReportFormProps {
  images: ImageData[];
  location?: {
    latitude: number | undefined;
    longitude: number | undefined;
    error: string | undefined;
    locationName?: string | undefined;
  };
}

export default function UploadFieldReportForm({
  images,
  location,
}: UploadFieldReportFormProps) {
  const { projectID } = useParams();
  const form = useForm<FieldReportFormData>({
    resolver: zodResolver(fieldReportSchema),
    defaultValues: {
      status_note: "",
    },
  });

  const { mutate, isPending } = useInsertMonitoringReportHook();

  const onSubmit = (data: FieldReportFormData) => {
    // Validate images
    if (!images || images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    // Validate each image file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    for (const imageData of images) {
      // Validate image file type
      if (!allowedTypes.includes(imageData.file.type)) {
        toast.error("Please upload valid image files (JPEG, PNG, or WebP)");
        return;
      }

      // Validate image file size
      if (imageData.file.size > maxSize) {
        toast.error("Each image file must be less than 5MB");
        return;
      }
    }

    // Calculate total size
    const totalSize = images.reduce((sum, img) => sum + img.file.size, 0);
    const maxTotalSize = 20 * 1024 * 1024; // 20MB total limit

    if (totalSize > maxTotalSize) {
      toast.error("Total images size must be less than 20MB");
      return;
    }

    mutate({
      ...data,
      project_id: projectID as string,
      images: images, // Pass all images
      location_name: location?.locationName,
      latitude: location?.latitude,
      longitude: location?.longitude,
    });
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {form.formState.errors.root && (
        <div className="text-red-500 text-sm">
          {form.formState.errors.root.message}
        </div>
      )}
      <FormTextarea label="Status Note" name="status_note" form={form} />
      <Button
        variant={isPending ? "ghost" : "default"}
        className="w-full md:w-auto"
        type="submit"
        disabled={isPending || !images || images.length === 0}
      >
        {isPending ? <Loader2 className="animate-spin" /> : "Submit Report"}
      </Button>
    </form>
  );
}
