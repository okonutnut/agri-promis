"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { ImageData } from "@/components/interfaces";
import { MonitoringReportType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import FormTextarea from "@/components/custom/input/form-textarea";
import FormMultiInput from "@/components/custom/input/form-multi-input";
import FormInput from "@/components/custom/input/form-input";
import NonFormInput from "@/components/custom/input/non-form-input";
import NonFormTextarea from "@/components/custom/input/non-form-textarea";
import NonFormMultiInput from "@/components/custom/input/non-form-multi-input";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import { TravelOrderDropdown } from "@/components/custom/dropdown/travel-order-dropdown";
import { TravelDateDropdown } from "@/components/custom/dropdown/travel-date-dropdown";
import { toast } from "sonner";
import { format } from "date-fns";
import { PostTravelWithDetails } from "@/app/types";

const ImageCaptureForm = dynamic(
  () => import("@/components/custom/forms/image-report-form"),
  { ssr: false },
);

const PrintPostTravelButton = dynamic(
  () => import("@/components/custom/print/print-post-travel-button"),
  { ssr: false },
);

const PrintMonitoringReportButton = dynamic(
  () => import("@/components/custom/print/print-monitoring-report-button"),
  { ssr: false },
);

// Unified schema for both report types
const unifiedReportSchema = z.object({
  project_location_id: z.string().optional(),
  travel_order_id: z.string().min(1, "Travel order is required"),
  travel_date_id: z.string().min(1, "Travel date is required"),
  travel_order_no: z.string().optional(),

  // Monitoring-specific fields
  purpose: z.string().optional(),
  findings: z.array(z.string()).optional(),
  observation: z.string().optional(),

  // Post-travel-specific fields
  project_title_activity: z.string().optional(),
  icc_fca_lgu_name: z.string().optional(),
  projects_places_visited: z.string().optional(),
  activities_undertaken: z.string().optional(),

  // Common fields
  issues_concern: z.array(z.string()).optional(),
  remarks: z.string().optional(),
});

export type UnifiedReportFormData = z.infer<typeof unifiedReportSchema>;

export type GenericReportFormProps = {
  type: "monitoring" | "post-travel";
  isAddMode?: boolean;
  isDraft?: boolean;
  values?: MonitoringReportType | PostTravelWithDetails | null;
  mutationFn: (data: any) => Promise<any>;
  invalidateKeys: string[];
  onSuccess?: () => Promise<void>;
  showDrafts?: boolean;
  draftKey?: string;
  SaveDraftComponent?: React.ComponentType<any>;
  DeleteDraftComponent?: React.ComponentType<any>;
  enableImageCapture?: boolean;
  locationID?: string;
  programID?: string;
  userID?: string;
  travelOrdersData?: any[];
  isAssignedToProgram?: boolean;
  onReview?: (id: string) => void;
  reviewButtonLabel?: string;
  reviewIsPending?: boolean;
  showReviewButton?: boolean;
  onRemarkReview?: () => void;
  remarkReviewIsPending?: boolean;
  showRemarkReviewButton?: boolean;
  renderBeforeFields?: React.ReactNode;
};

export function GenericReportForm({
  type,
  isAddMode = true,
  isDraft = false,
  values,
  mutationFn,
  invalidateKeys,
  onSuccess,
  showDrafts = false,
  draftKey,
  SaveDraftComponent,
  DeleteDraftComponent,
  enableImageCapture = true,
  locationID,
  programID,
  travelOrdersData = [],
  isAssignedToProgram = true,
  onReview,
  reviewButtonLabel = "Review",
  reviewIsPending = false,
  showReviewButton = false,
  onRemarkReview,
  remarkReviewIsPending = false,
  showRemarkReviewButton = false,
  renderBeforeFields,
}: GenericReportFormProps) {
  const params = useParams();
  const { closeSheet } = useSheet();
  const { openModal, closeModal } = useModal();

  const [images, setImages] = useState<ImageData[]>(
    (values as any)?.images || [],
  );
  const [selectedTravelOrderId, setSelectedTravelOrderId] = useState<
    string | null
  >(
    (values as any)?.travel_order?.id ||
      (values as any)?.travel_order_id ||
      null,
  );

  const effectiveLocationID =
    locationID ||
    (Array.isArray(params.locationID)
      ? params.locationID[0]
      : params.locationID) ||
    null;

  const form = useForm<UnifiedReportFormData>({
    resolver: zodResolver(unifiedReportSchema),
    defaultValues: {
      project_location_id:
        type === "monitoring" ? (effectiveLocationID as string) : "",
      travel_order_id:
        (values as any)?.travel_order?.id ||
        (values as any)?.travel_order_id ||
        "",
      travel_date_id:
        (values as any)?.travel_order?.travel_itinerary?.[0]?.id ||
        (values as any)?.travel_date_id ||
        "",
      travel_order_no: (values as any)?.travel_order_no || "",
      purpose: (values as any)?.purpose || "",
      findings: (values as any)?.findings ? [...(values as any).findings] : [],
      observation: (values as any)?.observation || "",
      project_title_activity: (values as any)?.project_title_activity || "",
      icc_fca_lgu_name: (values as any)?.icc_fca_lgu_name || "",
      projects_places_visited: (values as any)?.projects_places_visited || "",
      activities_undertaken: (values as any)?.activities_undertaken || "",
      issues_concern: (values as any)?.issues_concern
        ? [...(values as any).issues_concern]
        : [],
      remarks: (values as any)?.remarks || "",
    },
  });

  const travelOrderId = form.watch("travel_order_id");
  const travelDateId = form.watch("travel_date_id");

  const { mutate, isPending } = useUniversalMutation({
    mutationFn,
    invalidateKeys,
  });

  const hasTravelOrder = travelOrderId && travelOrderId.trim() !== "";
  const hasTravelDate = travelDateId && travelDateId.trim() !== "";
  const isSubmitDisabled =
    isPending || !hasTravelOrder || !hasTravelDate || !isAssignedToProgram;

  const inclusiveDates = () => {
    // For monitoring reports, get date from travel itinerary
    if (type === "monitoring" && (values as any)?.travel_date_id) {
      const travelDate = (values as any)?.travel_order?.travel_itinerary?.find(
        (item: any) => item.id === (values as any)?.travel_date_id,
      );
      if (travelDate?.date) {
        const startDate = format(new Date(travelDate.date), "MMM d, yyyy");
        if (travelDate.end_date) {
          const endDate = format(new Date(travelDate.end_date), "MMM d, yyyy");
          return `${startDate} - ${endDate}`;
        }
        return startDate;
      }
      return "N/A";
    }

    // For post-travel reports, dates are directly on the values object
    if (!(values as any)?.date) return "N/A";
    const startDate = format(new Date((values as any).date), "MMM d, yyyy");
    if (!(values as any)?.end_date) return startDate;
    const endDate = format(new Date((values as any).end_date), "MMM d, yyyy");
    return `${startDate} - ${endDate}`;
  };

  const onSubmit = async (data: UnifiedReportFormData) => {
    try {
      if (isAddMode && !isAssignedToProgram) {
        toast.error(
          "You are not assigned to this program. Please contact your administrator.",
        );
        return;
      }

      const selectedTravelOrder = travelOrdersData?.find(
        (order) => order.id === data.travel_order_id,
      );

      const cleanedData = {
        ...data,
        findings: (data.findings || []).filter((item) => item !== ""),
        issues_concern: (data.issues_concern || []).filter(
          (item) => item !== "",
        ),
        travel_order_no:
          selectedTravelOrder?.travel_order_no || data.travel_order_no || "",
        images,
      };

      // Remove project_location_id for post-travel (it uses program_id instead)
      if (type === "post-travel") {
        delete (cleanedData as any).project_location_id;
      } else {
        // Ensure project_location_id is set for monitoring
        (cleanedData as any).project_location_id = effectiveLocationID;
      }

      mutate(cleanedData, {
        onSuccess: async () => {
          const message =
            type === "monitoring"
              ? "Monitoring report submitted successfully!"
              : "Post-travel report submitted successfully!";
          toast.success(message);

          if (onSuccess) {
            await onSuccess();
          }

          form.reset();
          setImages([]);
          setSelectedTravelOrderId(null);
          closeSheet();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.message ||
            error?.toString() ||
            `Failed to submit ${type} report. Please try again.`;
          toast.error(errorMessage);
          console.error(`Error submitting ${type} report:`, error);
        },
      });
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.toString() ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      console.error("Error in form submission:", error);
    }
  };

  const onInvalidSubmit = () => {
    toast.error("Please fill in all required fields before submitting.");
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto h-[calc(90vh)] pb-12">
        {enableImageCapture && (
          <ImageCaptureForm
            isAddMode={isAddMode}
            values={values as any}
            images={images}
            setImages={setImages}
            enableOverlay={true}
            projectID={effectiveLocationID || programID}
          />
        )}

        <form
          className="space-y-3 p-2 border-t pt-4 mb-4"
          id="generic-report-form"
          onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
        >
          {/* Optional content rendered before form fields (e.g. program selector) */}
          {renderBeforeFields}

          {/* Travel Order and Date Selection */}
          {isAddMode || isDraft ? (
            <>
              <TravelOrderDropdown
                form={form as any}
                onTravelOrderSelect={(id: string, travelOrder) => {
                  setSelectedTravelOrderId(id);
                  // Auto-populate projects_places_visited for post-travel
                  if (
                    type === "post-travel" &&
                    travelOrder?.travel_itinerary &&
                    Array.isArray(travelOrder.travel_itinerary)
                  ) {
                    const destinations = travelOrder.travel_itinerary
                      .map((item) => item.destination)
                      .filter((dest) => dest && dest.trim() !== "")
                      .join(", ");
                    form.setValue("projects_places_visited", destinations);
                  }
                }}
              />
              <TravelDateDropdown
                form={form as any}
                travelOrderId={selectedTravelOrderId}
              />
            </>
          ) : (
            <>
              <NonFormInput
                label={
                  type === "post-travel" ? "Reporter Name:" : "Travel Order No:"
                }
                defaultValue={
                  type === "post-travel"
                    ? (values as any)?.fullname
                    : (values as any)?.travel_order?.travel_order_no ||
                      (values as any)?.travel_order_no ||
                      "N/A"
                }
                readOnly
              />
              <NonFormInput
                label="Inclusive Date of Travel:"
                defaultValue={inclusiveDates()}
                readOnly
              />
            </>
          )}

          {/* Post-travel print metadata */}
          {type === "post-travel" &&
            (isAddMode || isDraft ? (
              <>
                <FormInput
                  label="Project Title / Activity:"
                  name="project_title_activity"
                  form={form}
                  readOnly={!(isAddMode || isDraft)}
                />
                <FormInput
                  label="ICC / FCA / LGU Name:"
                  name="icc_fca_lgu_name"
                  form={form}
                  readOnly={!(isAddMode || isDraft)}
                />
              </>
            ) : (
              <>
                <NonFormInput
                  label="Project Title / Activity:"
                  defaultValue={
                    (values as any)?.project_title_activity || "N/A"
                  }
                  readOnly
                />
                <NonFormInput
                  label="ICC / FCA / LGU Name:"
                  defaultValue={(values as any)?.icc_fca_lgu_name || "N/A"}
                  readOnly
                />
              </>
            ))}

          {/* Monitoring-specific fields */}
          {type === "monitoring" && (
            <>
              {isAddMode ? (
                <>
                  <FormTextarea
                    label="Purpose:"
                    name="purpose"
                    form={form}
                    readOnly={!isAddMode}
                  />
                  <FormMultiInput
                    label="Findings:"
                    name="findings"
                    form={form}
                    values={(values as any)?.findings || null}
                    readOnly={!isAddMode}
                  />
                  <FormTextarea
                    label="Observation:"
                    name="observation"
                    form={form}
                    readOnly={!isAddMode}
                  />
                </>
              ) : (
                <>
                  <NonFormTextarea
                    label="Purpose:"
                    value={(values as any)?.purpose}
                    readOnly
                  />
                  <NonFormMultiInput
                    label="Findings:"
                    values={(values as any)?.findings || []}
                  />
                  <NonFormTextarea
                    label="Observation:"
                    value={(values as any)?.observation}
                    readOnly
                  />
                </>
              )}
            </>
          )}

          {/* Post-travel-specific fields */}
          {type === "post-travel" && (
            <>
              {isAddMode ? (
                <>
                  <FormTextarea
                    label="Projects Places Visited:"
                    name="projects_places_visited"
                    form={form}
                    readOnly={!isAddMode}
                  />
                  <FormTextarea
                    label="Activities Undertaken:"
                    name="activities_undertaken"
                    form={form}
                    readOnly={!isAddMode}
                  />
                </>
              ) : (
                <>
                  <NonFormTextarea
                    label="Projects Places Visited:"
                    value={(values as any)?.projects_places_visited}
                    readOnly
                  />
                  <NonFormTextarea
                    label="Activities Undertaken:"
                    value={(values as any)?.activities_undertaken}
                    readOnly
                  />
                </>
              )}
            </>
          )}

          {/* Common fields */}
          {isAddMode ? (
            <FormMultiInput
              label={
                type === "monitoring"
                  ? "Issues / Concerns:"
                  : "Issues / Concerns / Project % Accomplishment To Date:"
              }
              name="issues_concern"
              form={form}
              values={
                Array.isArray((values as any)?.issues_concern)
                  ? (values as any).issues_concern
                  : []
              }
              readOnly={!isAddMode}
            />
          ) : (
            <NonFormMultiInput
              label={
                type === "monitoring"
                  ? "Issues / Concerns:"
                  : "Issues / Concerns / Project % Accomplishment To Date:"
              }
              values={
                Array.isArray((values as any)?.issues_concern)
                  ? (values as any).issues_concern
                  : []
              }
            />
          )}
          {isAddMode ? (
            <FormTextarea
              label="Remarks:"
              name="remarks"
              form={form}
              readOnly={!isAddMode}
              noPlaceholder={!isAddMode}
            />
          ) : (
            <NonFormTextarea
              label="Remarks:"
              value={(values as any)?.remarks}
              readOnly
            />
          )}
        </form>
      </div>

      <CustomSheetFooter isPending={isPending || reviewIsPending}>
        <div className="flex items-center gap-2">
          {/* Draft actions */}
          {showDrafts && draftKey && DeleteDraftComponent && (
            <DeleteDraftComponent draftKey={draftKey} />
          )}

          {/* Print button for post-travel in view mode */}
          {!isAddMode &&
            type === "post-travel" &&
            (values as PostTravelWithDetails)?.reviewer_id && (
              <PrintPostTravelButton
                data={values as PostTravelWithDetails}
                btnName="Print"
                size="sm"
              />
            )}

          {/* Print button for monitoring report in view mode */}
          {!isAddMode &&
            type === "monitoring" &&
            (values as MonitoringReportType)?.reviewed_by_id && (
              <PrintMonitoringReportButton
                data={values as MonitoringReportType}
                btnName="Print"
                size="sm"
              />
            )}

          {/* Review button for view mode */}
          {!isAddMode && showReviewButton && onReview && (
            <Button
              size="sm"
              variant={reviewIsPending ? "ghost" : "default"}
              onClick={() => {
                openModal(
                  "Attention",
                  `Are you sure you want to ${reviewButtonLabel.toLowerCase()}?`,
                  <Button
                    className="w-full"
                    onClick={() => {
                      onReview((values as any)?.id as string);
                      closeModal();
                    }}
                  >
                    Confirm
                  </Button>,
                );
              }}
            >
              {reviewIsPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send />
                  {reviewButtonLabel}
                </>
              )}
            </Button>
          )}

          {/* Remark review button for monitoring reports */}
          {!isAddMode && showRemarkReviewButton && onRemarkReview && (
            <Button
              size="sm"
              variant={remarkReviewIsPending ? "ghost" : "default"}
              onClick={() => {
                openModal(
                  "Attention",
                  "Are you sure you want to submit for review?",
                  <Button
                    className="w-full"
                    onClick={() => {
                      onRemarkReview();
                      closeModal();
                    }}
                  >
                    Confirm
                  </Button>,
                );
              }}
            >
              {remarkReviewIsPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send />
                  Review
                </>
              )}
            </Button>
          )}

          {/* Save draft button */}
          {(isAddMode || isDraft) && showDrafts && SaveDraftComponent && (
            <SaveDraftComponent
              draftKey={draftKey}
              form={form}
              images={images ?? []}
              isPending={isPending}
            />
          )}

          {/* Submit button */}
          {(isAddMode || isDraft) && (
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
                      form.handleSubmit(onSubmit, onInvalidSubmit)();
                      closeModal();
                    }}
                  >
                    Confirm
                  </Button>,
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
          )}
        </div>
      </CustomSheetFooter>
    </>
  );
}
