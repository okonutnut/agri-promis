"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageData } from "@/components/interfaces";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import FormTextarea from "@/components/custom/input/form-textarea";
import FormMultiInput from "@/components/custom/input/form-multi-input";
import NonFormInput from "@/components/custom/input/non-form-input";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { InsertPostTravelReportAction } from "@/app/actions/PostTravelAction";
import {
  postTravelReportSchema,
  PostTravelReportFormData,
} from "./post-travel-form-schema";
import { TravelOrderDropdown } from "@/components/custom/dropdown/travel-order-dropdown";
import { TravelDateDropdown } from "@/components/custom/dropdown/travel-date-dropdown";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import AssignedProgramDropdown from "@/components/custom/dropdown/assigned-program-dropdown";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { CheckUserAssignedToProgramAction } from "@/app/actions/AssignedProgramAction";
import { PostTravelWithDetails } from "@/app/types";
import { format } from "date-fns";
const PrintPostTravelButton = dynamic(
  () => import("@/components/custom/print/print-post-travel-button"),
  { ssr: false },
);
const ImageCaptureForm = dynamic(
  () => import("@/components/custom/forms/image-report-form"),
  { ssr: false },
);

type CreatePostTravelFormProps = {
  isAddMode?: boolean;
  values?: PostTravelWithDetails;
};

export function CreatePostTravelForm({
  isAddMode = true,
  values,
}: CreatePostTravelFormProps) {
  const { programID } = useParams();
  const { closeSheet } = useSheet();
  const { openModal, closeModal } = useModal();

  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedTravelOrderId, setSelectedTravelOrderId] = useState<
    string | null
  >(values?.travel_order_id || null);
  const [programId, setProgramId] = useState<string | null>(
    values?.program_id || (programID as string) || null,
  );

  // Check if user is assigned to the program (when programId is available)
  const { data: isAssignedToProgram } = useRealtimeQuery({
    queryKey: ["user-program-assignment-post-travel", programId || "none"],
    queryFn: () =>
      programId
        ? CheckUserAssignedToProgramAction(programId)
        : Promise.resolve(false),
    table: "assigned_fieldtechnicians",
  });

  const form = useForm<PostTravelReportFormData>({
    resolver: zodResolver(postTravelReportSchema),
    defaultValues: {
      travel_order_id: values?.travel_order_id || "",
      travel_date_id: values?.travel_date_id || "",
      projects_places_visited: values?.projects_places_visited || "",
      activities_undertaken: values?.activities_undertaken || "",
      issues_concern: Array.isArray(values?.issues_concern)
        ? values.issues_concern
        : [],
      remarks: values?.remarks || "",
    },
  });

  useEffect(() => {
    if (programID) {
      setProgramId(programID as string);
    } else if (values?.program_id) {
      setProgramId(values.program_id);
    }
    form.setValue("program_id", programId as string);
  }, [programID, values?.program_id, form, programId]);

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (
      data: PostTravelReportFormData & { images: ImageData[] },
    ) =>
      await InsertPostTravelReportAction({
        program_id: data.program_id,
        travel_order_id: data.travel_order_id,
        travel_date_id: data.travel_date_id,
        projects_places_visited: data.projects_places_visited,
        activities_undertaken: data.activities_undertaken,
        issues_concern: data.issues_concern || [],
        remarks: data.remarks,
        images: data.images.map((img) => ({ file: img.file })),
      }),
    invalidateKeys: ["post_travel_reports"],
  });

  const onSubmit = async (data: PostTravelReportFormData) => {
    try {
      // Check if user is assigned to program (client-side validation)
      if (isAddMode && programId && !isAssignedToProgram) {
        toast.error(
          "You are not assigned to this program. Please contact your administrator.",
        );
        return;
      }

      const cleanedData = {
        ...data,
        issues_concern: (data.issues_concern || []).filter(
          (item) => item !== "",
        ),
        images,
      };

      mutate(cleanedData, {
        onSuccess: () => {
          toast.success("Post-travel report submitted successfully!");
          form.reset();
          setImages([]);
          setSelectedTravelOrderId(null);
          closeSheet();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.message ||
            error?.toString() ||
            "Failed to submit post-travel report. Please try again.";
          toast.error(errorMessage);
          console.error("Error submitting post-travel report:", error);
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

  const inclusiveDates = () => {
    if (!values?.date) return "N/A";
    const startDate = format(new Date(values.date), "MMM d, yyyy");
    if (!values.end_date) return startDate;
    const endDate = format(new Date(values.end_date), "MMM d, yyyy");
    return `${startDate} - ${endDate}`;
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto h-[calc(90vh)] pb-12">
        <ImageCaptureForm
          isAddMode={isAddMode}
          values={values}
          images={images}
          setImages={setImages}
          enableOverlay={true}
          programID={programId || undefined}
        />
        <form
          className="space-y-3 p-2 border-t pt-4 mb-4"
          id="post-travel-report-form"
          onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
        >
          {isAddMode ? (
            <>
              {!programID && (
                <AssignedProgramDropdown
                  onChange={(program) => form.setValue("program_id", program)}
                />
              )}
              <TravelOrderDropdown
                form={form}
                onTravelOrderSelect={(id: string, travelOrder) => {
                  setSelectedTravelOrderId(id);
                  // Set projects_places_visited from itinerary destinations
                  if (
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
                form={form}
                travelOrderId={selectedTravelOrderId}
              />
            </>
          ) : (
            <>
              <NonFormInput
                label="Reporter Name:"
                defaultValue={values?.fullname}
                readOnly
              />
              <NonFormInput
                label="Travel Order No:"
                defaultValue={values?.travel_order_no}
                readOnly
              />
              <NonFormInput
                label="Inclusive Date of Travel:"
                defaultValue={inclusiveDates()}
                readOnly
              />
            </>
          )}
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
          <FormMultiInput
            label="Issues / Concerns / Project % Accomplishment To Date:"
            name="issues_concern"
            form={form}
            values={
              Array.isArray(values?.issues_concern) ? values.issues_concern : []
            }
            readOnly={!isAddMode}
          />
          <FormTextarea
            label="Remarks:"
            name="remarks"
            form={form}
            {...(values?.remarks
              ? { defaultValue: values?.remarks }
              : { noPlaceholder: true })}
            readOnly={!isAddMode}
            noPlaceholder={!isAddMode}
          />
        </form>
      </div>
      <CustomSheetFooter isPending={isPending}>
        <div className="flex items-center gap-2">
          {!isAddMode && values?.reviewer_id && values && (
            <PrintPostTravelButton data={values} btnName="Print" size="sm" />
          )}
          {isAddMode && (
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
                      form.handleSubmit(onSubmit, onInvalidSubmit)();
                      closeModal();
                    }}
                  >
                    Confirm
                  </Button>,
                );
              }}
              size="sm"
              disabled={isPending}
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

// Export for view mode
export function PostTravelForm({
  data,
}: {
  data: PostTravelWithDetails | null;
}) {
  return <CreatePostTravelForm isAddMode={false} values={data ?? undefined} />;
}
