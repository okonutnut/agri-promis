"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import ImageCaptureForm from "./image-report-form";
import FormInput from "@/components/custom/input/form-input";
import FormTextarea from "@/components/custom/input/form-textarea";
import FormMultiInput from "@/components/custom/input/form-multi-input";
import NonFormTextarea from "@/components/custom/input/non-form-textarea";
import SaveDraftButton from "../components/save-draft-button";
import DeleteDraftButton from "../components/delete-draft-button";
import PrintMonitoringButton from "../components/print-monitoring";
import { useInsertMonitoringReportHook } from "@/components/hooks";
import { deleteDraft } from "@/hooks/use-draft";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const fieldReportSchema = z.object({
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

  const { mutate, isPending, isSuccess } = useInsertMonitoringReportHook();

  const onSubmit = useCallback(
    async (data: FieldReportFormData) => {
      if (!validateImages(images)) return;

      await deleteDraft(values?.key as string);

      mutate({
        ...data,
        project_id: projectID as string,
        images,
      });
    },
    [images, mutate, projectID, values?.key]
  );

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      setImages([]);
      onOpenChange();
    }
  }, [isSuccess, form, onOpenChange]);

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
          className="space-y-4 p-2 border-t pt-4 overflow-x-hidden"
          id="upload-monitoring-report-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {form.formState.errors.root && (
            <div className="text-red-500 text-sm">
              {form.formState.errors.root.message}
            </div>
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
        {(isDraft || !isAddMode) && (
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
            {isPending ? <Loader2 className="animate-spin" /> : "Submit Report"}
          </Button>
        )}
      </SheetFooter>
    </>
  );
}
