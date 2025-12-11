"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";
import { ImageData } from "@/components/interfaces";
import { MonitoringReportType, ReportType } from "@/components/types";
import { deleteDraft } from "@/hooks/use-draft";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import FormInput from "@/components/custom/input/form-input";
import FormTextarea from "@/components/custom/input/form-textarea";
import FormMultiInput from "@/components/custom/input/form-multi-input";
import NonFormInput from "@/components/custom/input/non-form-input";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { InsertMonitoringReportAction } from "@/app/actions/MonitoringAction";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import ImageCaptureForm from "./image-report-form";
import PrintDownloadDropdown from "@/components/custom/print/print-download-dropdown";
import MonitoringReportDocument from "@/components/custom/pdf/monitoring-reports-document";
import SaveDraftButton from "../components/save-draft-button";
import DeleteDraftButton from "../components/delete-draft-button";
import TravelOrderDropdown from "../components/travel-order-combobox";
import { validateImages } from "@/utils/helpers/validateImages";

const fieldReportSchema = z.object({
  report_type_id: z.string().optional(),
  project_location_id: z.string().optional(),
  travel_order_no: z.string().min(1, "Travel order number is required"),
  inclusive_date_of_travel: z.string().optional(),
  purpose: z.string().optional(),
  findings: z.array(z.string()).optional(),
  observation: z.string().optional(),
  issues_concern: z.array(z.string()).optional(),
  remarks: z.string().optional(),
});
type FieldReportFormData = z.infer<typeof fieldReportSchema>;

type UploadFieldReportFormProps = {
  isAddMode?: boolean;
  isDraft?: boolean;
  values?: MonitoringReportType | null;
  reportType?: ReportType;
};

export default function UploadFieldReportForm({
  isAddMode,
  isDraft,
  values,
  reportType,
}: UploadFieldReportFormProps) {
  const { projectID } = useParams();
  const { closeSheet } = useSheet();
  const { openModal, closeModal } = useModal();

  const [images, setImages] = useState<ImageData[]>(values?.images || []);

  const form = useForm<FieldReportFormData>({
    resolver: zodResolver(fieldReportSchema),
    defaultValues: {
      report_type_id: reportType?.id || values?.report_type_id || "",
      project_location_id: projectID as string,
      purpose: values?.purpose || "",
      inclusive_date_of_travel: values?.inclusive_date_of_travel || "",
      findings: values?.findings ? [...values.findings] : [],
      issues_concern: values?.issues_concern ? [...values.issues_concern] : [],
      observation: values?.observation || "",
      remarks: values?.remarks || "",
    },
  });

  // const { mutate, isPending } = useInsertMonitoringReportHook();
  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: any) => await InsertMonitoringReportAction(data),
    invalidateKeys: ["monitoring-report", projectID as string],
  });

  const onSubmit = async (data: FieldReportFormData) => {
    if (!validateImages(images)) return;

    const cleanedData = {
      ...data,
      findings: (data.findings || []).filter((item) => item !== ""),
      issues_concern: (data.issues_concern || []).filter((item) => item !== ""),
      project_location_id: projectID as string,
      report_type_id: (reportType?.id || values?.report_type_id) as string,
      images,
    };

    mutate(
      { ...cleanedData },
      {
        onSuccess: async () => {
          await deleteDraft(values?.key as string);
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
              label="Travel Order No:"
              defaultValue={values?.travel_order?.travel_order_no}
              readOnly
            />
          )}
          {reportType?.code === "PTR" && (
            <FormInput
              label="Inclusive Date of Travel:"
              name="inclusive_date_of_travel"
              type="date"
              form={form}
              readOnly={!isAddMode}
            />
          )}
          <FormInput
            label={
              reportType?.code === "MR" ? "Purpose:" : "Activities Undertaken:"
            }
            name="purpose"
            form={form}
            readOnly={!isAddMode}
          />
          {reportType?.code === "MR" && (
            <>
              <FormMultiInput
                label="Findings:"
                name="findings"
                form={form}
                values={values?.findings || null}
                readOnly={!isAddMode}
              />
              <FormTextarea
                label="Observation:"
                name="observation"
                form={form}
                readOnly={!isAddMode}
              />
            </>
          )}
          <FormMultiInput
            label={
              reportType?.code === "MR"
                ? "Issues / Concerns:"
                : "Issues / Concerns / Project % Accomplishment To Date:"
            }
            name="issues_concern"
            form={form}
            values={values?.issues_concern || null}
            readOnly={!isAddMode}
          />
          <FormTextarea
            label="Remarks:"
            name="remarks"
            form={form}
            readOnly={!isAddMode}
            noPlaceholder={!isAddMode}
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
