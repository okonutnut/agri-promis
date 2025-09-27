"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { ImageData } from "@/components/interfaces";
import { MonitoringReportType } from "@/components/types";
import { useInsertMonitoringReportHook } from "@/components/hooks";
import { deleteDraft } from "@/hooks/use-draft";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import FormInput from "@/components/custom/input/form-input";
import FormTextarea from "@/components/custom/input/form-textarea";
import FormMultiInput from "@/components/custom/input/form-multi-input";
import NonFormTextarea from "@/components/custom/input/non-form-textarea";
import NonFormInput from "@/components/custom/input/non-form-input";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import ImageCaptureForm from "./image-report-form";
const SaveDraftButton = dynamic(
  () => import("../components/save-draft-button"),
  { ssr: false }
);
const DeleteDraftButton = dynamic(
  () => import("../components/delete-draft-button"),
  { ssr: false }
);
import PrintDownloadDropdown from "@/components/custom/print/print-download-dropdown";
import MonitoringReportDocument from "@/components/custom/pdf/monitoring-reports-document";
const TravelOrderDropdown = dynamic(
  () => import("../components/travel-order-combobox"),
  { ssr: false }
);

const fieldReportSchema = z.object({
  travel_order_no: z.string().min(1, "Travel order number is required"),
  purpose: z.string().min(1, "Purpose is required"),
  findings: z.array(z.string()),
  observation: z
    .string()
    .optional()
    .refine((value) => !value || (value.length >= 5 && value.length <= 700), {
      message: "Observation must be between 5 and 700 characters if provided",
    }),
  issues_concern: z.array(z.string()),
  remarks: z.string().min(1, "Remarks is required"),
});
type FieldReportFormData = z.infer<typeof fieldReportSchema>;

type UploadFieldReportFormProps = {
  isAddMode?: boolean;
  isDraft?: boolean;
  values?: MonitoringReportType | null;
};

// Image validation
const validateImages = (images: ImageData[]) => {
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

export default function UploadFieldReportForm({
  isAddMode,
  isDraft,
  values,
}: UploadFieldReportFormProps) {
  const { projectID } = useParams();
  const { closeSheet } = useSheet();
  const { openModal, closeModal } = useModal();

  const [images, setImages] = useState<ImageData[]>(values?.images || []);

  const form = useForm<FieldReportFormData>({
    resolver: zodResolver(fieldReportSchema),
    defaultValues: {
      purpose: values?.purpose || "",
      findings: values?.findings ? [...values.findings] : [],
      issues_concern: values?.issues_concern ? [...values.issues_concern] : [],
      observation: values?.observation || "",
      remarks: values?.remarks || "",
    },
  });

  const { mutate, isPending } = useInsertMonitoringReportHook();
  const onSubmit = async (data: FieldReportFormData) => {
    if (!validateImages(images)) return;

    const cleanedData = {
      ...data,
      findings: (data.findings || []).filter((item) => item !== ""),
      issues_concern: (data.issues_concern || []).filter((item) => item !== ""),
    };

    await deleteDraft(values?.key as string);

    mutate(
      { ...cleanedData, project_id: projectID as string, images },
      {
        onSuccess: () => {
          form.reset();
          setImages([]);
          closeSheet();
        },
      }
    );
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto h-[calc(90vh)] pb-12">
        <ImageCaptureForm
          isAddMode={isAddMode}
          values={values}
          images={images}
          setImages={setImages}
        />
        <form
          className="space-y-3 p-2 border-t pt-4 mb-4"
          id="upload-monitoring-report-form"
          onSubmit={form.handleSubmit(onSubmit)}
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
          <FormTextarea
            label="Remarks"
            name="remarks"
            form={form}
            readonly={!isAddMode}
          />
        </form>
      </div>
      <CustomSheetFooter isPending={isPending}>
        {values?.reviewed_by_id && (
          <PrintDownloadDropdown
            data={<MonitoringReportDocument data={values} />}
            values={values}
          />
        )}
        {values?.key && <DeleteDraftButton draftKey={values.key} />}
        {isAddMode && (
          <>
            <SaveDraftButton
              draftKey={values?.key as string}
              form={form}
              images={images ?? []}
              isPending={isPending}
            />
            <Button
              variant={isPending ? "ghost" : "default"}
              type="button"
              onClick={() => {
                openModal(
                  "Attention",
                  "You confirm that all information provided is correct.",
                  <Button
                    className="w-full"
                    onClick={() => {
                      form.handleSubmit(onSubmit)();
                      closeModal();
                    }}
                  >
                    Confirm
                  </Button>
                );
              }}
              size="sm"
              disabled={
                isPending || !form.formState.isValid || images.length === 0
              }
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send /> Submit
                </>
              )}
            </Button>
          </>
        )}
      </CustomSheetFooter>
    </>
  );
}
