"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";
import { ImageData } from "@/components/interfaces";
import { MonitoringReportType, TravelOrderProjectsType } from "@/components/types";
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
import ImageCaptureForm from "../../../../../../components/custom/forms/image-report-form";
import PrintDownloadDropdown from "@/components/custom/print/print-download-dropdown";
import MonitoringReportDocument from "@/components/custom/pdf/monitoring-reports-document";
import SaveDraftButton from "../components/save-draft-button";
import DeleteDraftButton from "../components/delete-draft-button";
import { TravelOrderDropdown } from "@/components/custom/dropdown/travel-order-dropdown";
import { TravelDateDropdown } from "@/components/custom/dropdown/travel-date-dropdown";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllTravelOrdersByUserIDAction } from "@/app/actions/TravelOrderAction";
import { useSupabaseSession } from "@/hooks/use-session";
import { toast } from "sonner";
import { format } from "date-fns";

const fieldReportSchema = z.object({
  project_location_id: z.string().optional(),
  travel_order_id: z.string().min(1, "Travel order is required"),
  travel_date_id: z.string().min(1, "Travel date is required"),
  travel_order_no: z.string().optional(), // For backward compatibility with action
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
};

export default function UploadFieldReportForm({
  isAddMode,
  isDraft,
  values,
}: UploadFieldReportFormProps) {
  const { projectID } = useParams();
  const { closeSheet } = useSheet();
  const { openModal, closeModal } = useModal();
  const { data: userData } = useSupabaseSession();

  const [images, setImages] = useState<ImageData[]>(values?.images || []);
  const [selectedTravelOrderId, setSelectedTravelOrderId] = useState<
    string | null
  >(values?.travel_order?.id || values?.travel_order_id || null);

  // Get travel orders to look up travel_order_no and date
  const { data: travelOrders } = useRealtimeQuery({
    queryKey: ["travel-orders"],
    queryFn: () => SelectAllTravelOrdersByUserIDAction(userData?.user.id),
    table: "travel_order",
  });

  const form = useForm<FieldReportFormData>({
    resolver: zodResolver(fieldReportSchema),
    defaultValues: {
      project_location_id: projectID as string,
      travel_order_id: values?.travel_order?.id || values?.travel_order_id || "",
      travel_date_id: values?.travel_order?.travel_itinerary?.[0]?.id || values?.travel_date_id || "",
      travel_order_no: values?.travel_order_no || "",
      purpose: values?.purpose || "",
      findings: values?.findings ? [...values.findings] : [],
      issues_concern: values?.issues_concern ? [...values.issues_concern] : [],
      observation: values?.observation || "",
      remarks: values?.remarks || "",
    },
  });

  // Watch travel_order_id and travel_date_id to disable submit button
  const travelOrderId = form.watch("travel_order_id");
  const travelDateId = form.watch("travel_date_id");

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: any) => await InsertMonitoringReportAction(data),
    invalidateKeys: ["monitoring-report", projectID as string],
  });

  const onSubmit = async (data: FieldReportFormData) => {
    try {
      // Remove image validation - images are now optional
      // if (!validateImages(images)) {
      //   toast.error("Please add at least one image to submit the report.");
      //   return;
      // }

      // Get travel_order_no from selected ID
      const selectedTravelOrder = travelOrders?.find(
        (order) => order.id === data.travel_order_id
      );

      const cleanedData = {
        ...data,
        findings: (data.findings || []).filter((item) => item !== ""),
        issues_concern: (data.issues_concern || []).filter((item) => item !== ""),
        project_location_id: projectID as string,
        travel_order_no: selectedTravelOrder?.travel_order_no || data.travel_order_no || "",
        travel_date_id: data.travel_date_id,
        images,
      };

      console.log(cleanedData);

      mutate(
        { ...cleanedData },
        {
          onSuccess: async () => {
            toast.success("Monitoring report submitted successfully!");
            await deleteDraft(values?.key as string);
            form.reset();
            setImages([]);
            setSelectedTravelOrderId(null);
            closeSheet();
          },
          onError: (error: any) => {
            const errorMessage = error?.message || error?.toString() || "Failed to submit monitoring report. Please try again.";
            toast.error(errorMessage);
            console.error("Error submitting monitoring report:", error);
          },
        }
      );
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      console.error("Error in form submission:", error);
    }
  };

  // Check if submit should be disabled - properly handle empty strings, null, undefined
  const hasTravelOrder = travelOrderId && travelOrderId.trim() !== "";
  const hasTravelDate = travelDateId && travelDateId.trim() !== "";
  const isSubmitDisabled = isPending || !hasTravelOrder || !hasTravelDate;

  return (
    <>
      <div className="flex-1 overflow-y-auto h-[calc(90vh)] pb-12">
        <ImageCaptureForm
          isAddMode={isAddMode}
          values={values}
          images={images}
          setImages={setImages}
          enableOverlay={true}
          projectID={Array.isArray(projectID) ? projectID[0] : projectID as string}
        />
        <form
          className="space-y-3 p-2 border-t pt-4 mb-4"
          id="upload-monitoring-report-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {isAddMode || isDraft ? (
            <>
              <TravelOrderDropdown
                form={form as any}
                onTravelOrderSelect={(id: string) => setSelectedTravelOrderId(id)}
              />
              <TravelDateDropdown
                form={form as any}
                travelOrderId={selectedTravelOrderId}
              />
            </>
          ) : (
            <>
              <NonFormInput
                label="Travel Order No:"
                defaultValue={values?.travel_order?.travel_order_no}
                readOnly
              />
              <NonFormInput
                label="Inclusive Date of Travel:"
                defaultValue={format(new Date(values?.travel_order?.travel_itinerary?.[0]?.date || ""), "MMM d, yyyy")}
                readOnly
              />
            </>
          )}
          <FormInput
            label="Purpose:"
            name="purpose"
            form={form}
            readOnly={!isAddMode}
          />
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
          <FormMultiInput
            label="Issues / Concerns:"
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
        {values?.key && <DeleteDraftButton draftKey={values.key} />}
        {(isAddMode || isDraft) && (
          <>
            <SaveDraftButton
              draftKey={values?.key as string}
              form={form}
              images={images ?? []}
              isPending={isPending}
            />
            <Button
              variant={isSubmitDisabled ? "ghost" : "default"}
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
              disabled={isSubmitDisabled}
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
