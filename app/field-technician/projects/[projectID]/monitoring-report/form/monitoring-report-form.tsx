"use client";

import dynamic from "next/dynamic";
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import {
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ImageData } from "@/components/interfaces";
import { MonitoringReportType } from "@/components/types";
import { useInsertMonitoringReportHook } from "@/components/hooks";
import { deleteDraft } from "@/hooks/use-draft";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
const TravelOrderDropdown = dynamic(
  () => import("../components/travel-order-combobox"),
  {
    ssr: false,
  }
);
const ImageCaptureForm = dynamic(() => import("./image-report-form"), {
  ssr: false,
});
const FormInput = dynamic(
  () => import("@/components/custom/input/form-input"),
  {
    ssr: false,
  }
);
const FormTextarea = dynamic(
  () => import("@/components/custom/input/form-textarea"),
  { ssr: false }
);
const FormMultiInput = dynamic(
  () => import("@/components/custom/input/form-multi-input"),
  { ssr: false }
);
const NonFormTextarea = dynamic(
  () => import("@/components/custom/input/non-form-textarea"),
  { ssr: false }
);
const SaveDraftButton = dynamic(
  () => import("../components/save-draft-button"),
  { ssr: false }
);
const DeleteDraftButton = dynamic(
  () => import("../components/delete-draft-button"),
  { ssr: false }
);
const NonFormInput = dynamic(
  () => import("@/components/custom/input/non-form-input"),
  { ssr: false }
);
const PrintMonitoringButton = dynamic(
  () => import("../components/print-monitoring"),
  {
    ssr: false,
  }
);

const fieldReportSchema = z.object({
  travel_order_no: z.string().min(1, "Travel order number is required"),
  purpose: z.string().min(1, "Purpose is required"),
  findings: z.array(z.string()).min(1, "At least one finding is required"),
  observation: z
    .string()
    .min(1, "Observation is required")
    .min(5, "Observation must be at least 5 characters")
    .max(700, "Observation must not exceed 700 characters"),
  issues_concern: z.array(z.string()).min(1, "At least one issue is required"),
});
type FieldReportFormData = z.infer<typeof fieldReportSchema>;

type UploadFieldReportFormProps = {
  onOpenChange: () => void;
  isAddMode?: boolean;
  isDraft?: boolean;
  values?: MonitoringReportType | null;
};

const validateImages = (images: ImageData[]) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 1 * 1024 * 1024; // 1MB per image
  const maxTotalSize = 20 * 1024 * 1024; // 20MB total limit

  if (!images || images.length === 0) {
    toast.error("At least one image is required");
    return false;
  }

  for (const imageData of images) {
    if (!allowedTypes.includes(imageData.file.type)) {
      toast.error("Please upload valid image files (JPEG, PNG, or WebP)");
      return false;
    }
    if (imageData.file.size > maxSize) {
      toast.error("Each image file must be less than 1MB");
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

export default function UploadFieldReportForm({
  onOpenChange,
  isAddMode,
  isDraft,
  values,
}: UploadFieldReportFormProps) {
  const { projectID } = useParams();

  const [images, setImages] = useState<ImageData[]>(values?.images || []);

  const defaultValues = useMemo(
    () => ({
      purpose: values?.purpose || "",
      findings: values?.findings || [],
      issues_concern: values?.issues_concern || [],
      observation: values?.observation || "",
    }),
    [values]
  );

  const form = useForm<FieldReportFormData>({
    resolver: zodResolver(fieldReportSchema),
    defaultValues,
  });

  const { mutate, isPending } = useInsertMonitoringReportHook();
  const onSubmit = useCallback(
    async (data: FieldReportFormData) => {
      if (!validateImages(images)) return;

      await deleteDraft(values?.key as string);

      mutate(
        {
          ...data,
          project_id: projectID as string,
          images,
        },
        {
          onSuccess: () => {
            form.reset();
            setImages([]);
            onOpenChange();
          },
        }
      );
    },
    [images, mutate, projectID, values?.key]
  );

  return (
    <>
      <SheetHeader className="border-b flex-row justify-between items-start">
        <SheetTitle className="text-primary uppercase">
          {isAddMode
            ? "Upload New Post Activity Report"
            : "View Post Activity Report Details"}
        </SheetTitle>
        {!isAddMode && <PrintMonitoringButton data={values ?? null} />}
      </SheetHeader>
      <section className="overflow-y-auto">
        <ImageCaptureForm
          isAddMode={isAddMode}
          values={values}
          images={images}
          setImages={setImages}
        />
        <form
          className="space-y-3 p-2 border-t pt-4 overflow-x-hidden"
          id="upload-monitoring-report-form"
          onSubmit={form.handleSubmit((data) => onSubmit(data))}
        >
          {isAddMode || isDraft ? (
            <TravelOrderDropdown form={form} />
          ) : (
            <NonFormInput
              label="Travel Order No"
              defaultValue={values?.travel_order?.travel_order_no}
              readonly
            />
          )}
          <FormInput
            label="Purpose"
            name="purpose"
            form={form}
            readonly={!isAddMode}
          />
          <FormMultiInput
            label="Findings"
            name="findings"
            form={form}
            values={values?.findings || null}
            readOnly={!isAddMode}
          />
          <FormTextarea
            label="Observation"
            name="observation"
            form={form}
            readonly={!isAddMode}
          />
          <FormMultiInput
            label="Issues & Concern"
            name="issues_concern"
            form={form}
            values={values?.issues_concern || null}
            readOnly={!isAddMode}
          />
          {!isAddMode && (
            <NonFormTextarea
              label="Remarks"
              defaultValue={values?.remarks || "N/A"}
              readonly
              noPlaceholder
            />
          )}
        </form>
      </section>
      <SheetFooter className="border-t flex-row justify-end p-2">
        <SheetClose asChild>
          <Button variant="outline" disabled={isPending} size={"sm"}>
            Close
          </Button>
        </SheetClose>
        {values?.key != null && (
          <DeleteDraftButton
            draftKey={values?.key as string}
            onOpenChange={onOpenChange}
          />
        )}
        {isAddMode && (
          <SaveDraftButton
            draftKey={values?.key as string}
            form={form}
            images={images}
            isPending={isPending}
            onOpenChange={onOpenChange}
          />
        )}
        {isAddMode && (
          <Button
            variant={isPending ? "ghost" : "default"}
            form="upload-monitoring-report-form"
            size={"sm"}
            disabled={isPending || !images || images.length === 0}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Send />
                Submit
              </>
            )}
          </Button>
        )}
      </SheetFooter>
    </>
  );
}
