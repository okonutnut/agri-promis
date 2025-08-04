"use client";

import FormTextarea from "@/components/custom/input/form-textarea";
import FormMultiInput from "@/components/custom/input/form-multi-input";
import { useInsertMonitoringReportHook } from "@/components/hooks";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { ImageData, LocationData } from "@/components/interfaces";
import { MonitoringReportType } from "@/components/types";
import { useEffect, useRef, useState } from "react";
import ImageCaptureForm from "./image-report-form";
import FormInput from "@/components/custom/input/form-input";
import SaveDraftButton from "../components/draft-button";

const fieldReportSchema = z.object({
  purpose: z.string().min(1, "Purpose is required"),
  findings: z.array(z.string()).min(1, "At least one finding is required"),
  observation: z
    .string()
    .min(1, "Observation is required")
    .min(5, "Observation must be at least 5 characters")
    .max(500, "Observation must not exceed 500 characters"),
  issues_concern: z.array(z.string()).min(1, "At least one issue is required"),
  remarks: z
    .string()
    .optional()
    .refine(
      (val: string | undefined) => {
        if (val && val.length < 5) {
          return false;
        }
        return true;
      },
      {
        message: "Remarks must be at least 5 characters when provided",
      }
    ),
});

type FieldReportFormData = z.infer<typeof fieldReportSchema>;

type UploadFieldReportFormProps = {
  isAddMode?: boolean;
  values?: MonitoringReportType | null;
};

export default function UploadFieldReportForm({
  isAddMode,
  values,
}: UploadFieldReportFormProps) {
  const { projectID } = useParams();
  const [location, setLocation] = useState<LocationData>({
    latitude: undefined,
    longitude: undefined,
    locationName: undefined,
    error: undefined,
  });
  const [isDrafted, setIsDrafted] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const form = useForm<FieldReportFormData>({
    resolver: zodResolver(fieldReportSchema),
    defaultValues: {
      observation: values?.observation || "",
      remarks: values?.remarks || "",
    },
  });

  // Hook for inserting monitoring report
  const { mutate, isPending, isSuccess } = useInsertMonitoringReportHook();
  const onSubmit = (data: FieldReportFormData) => {
    form.setValue("remarks", "");
    // Validate images
    if (!images || images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    // Validate each image file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes

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
      images: images,
    });
  };

  // Reset form and state on successful submission
  useEffect(() => {
    if (isSuccess || isDrafted) {
      form.reset();
      setImages([]);
      setLocation({
        latitude: undefined,
        longitude: undefined,
        locationName: undefined,
        error: undefined,
      });
      closeBtnRef.current?.click();
    }
  }, [isSuccess, isDrafted, form, closeBtnRef]);

  return (
    <>
      <section className="overflow-y-auto">
        <ImageCaptureForm
          isAddMode={isAddMode}
          values={values}
          location={location}
          setLocation={setLocation}
          images={images}
          setImages={setImages}
        />
        <form
          className="space-y-4 m-2 border-t pt-4"
          id="upload-monitoring-report-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {form.formState.errors.root && (
            <div className="text-red-500 text-sm">
              {form.formState.errors.root.message}
            </div>
          )}
          <FormInput label="Purpose" name="purpose" form={form} />
          {/* Findings */}
          <FormMultiInput
            label="Findings"
            name="findings"
            form={form}
            values={values?.findings || null}
          />
          <FormTextarea
            label="Observation"
            name="observation"
            form={form}
            readonly={!!values}
          />
          {/* Issues and Concerns */}
          <FormMultiInput
            label="Issues & Concern"
            name="issues_concern"
            form={form}
            values={values?.issues_concern || null}
          />
          {!isAddMode && (
            <FormTextarea
              label="Remarks"
              name="remarks"
              form={form}
              readonly={!!values}
              noPlaceholder
            />
          )}
        </form>
      </section>
      <SheetFooter className="border-t flex-row justify-end">
        <SheetClose asChild>
          <Button
            variant="outline"
            ref={closeBtnRef}
            className="w-full md:w-auto"
          >
            Close
          </Button>
        </SheetClose>
        {isAddMode && (
          <SaveDraftButton
            draftKey={values?.key as string}
            form={form}
            images={images}
            projectID={projectID as string}
            isPending={isPending}
            setIsDrafted={setIsDrafted}
          />
        )}
        {!values && (
          <Button
            variant={isPending ? "ghost" : "default"}
            form="upload-monitoring-report-form"
            disabled={isPending || !images || images.length === 0}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Submit Report"}
          </Button>
        )}
      </SheetFooter>
    </>
  );
}
