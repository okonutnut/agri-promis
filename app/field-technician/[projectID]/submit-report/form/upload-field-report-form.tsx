import FormTextarea from "@/components/custom/input/form-textarea";
import { useInsertFieldReportHook } from "@/components/hooks";
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
    .min(5, "Status note must be at least 10 characters")
    .max(500, "Status note must not exceed 500 characters"),
});

type FieldReportFormData = z.infer<typeof fieldReportSchema>;

interface UploadFieldReportFormProps {
  image_file: File | undefined;
  date_time_captured: string;
  location?: {
    latitude: number | undefined;
    longitude: number | undefined;
    error: string | undefined;
    locationName?: string | undefined;
  };
}

export default function UploadFieldReportForm({
  image_file,
  date_time_captured,
  location,
}: UploadFieldReportFormProps) {
  const { projectID } = useParams();
  const form = useForm<FieldReportFormData>({
    resolver: zodResolver(fieldReportSchema),
    defaultValues: {
      status_note: "",
    },
  });

  const { mutate, isPending } = useInsertFieldReportHook();

  const onSubmit = (data: FieldReportFormData) => {
    // Validate image file
    if (!image_file) {
      toast.error("Image file is required");
      return;
    }

    // Validate image file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(image_file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate image file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (image_file.size > maxSize) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    mutate({
      ...data,
      project_id: projectID as string,
      date_time_captured: date_time_captured,
      image_file,
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
        disabled={isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : "Submit Report"}
      </Button>
    </form>
  );
}
