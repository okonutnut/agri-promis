
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostTravelReportType } from "@/components/types";
import { ImageData } from "@/components/interfaces";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import FormInput from "@/components/custom/input/form-input";
import FormTextarea from "@/components/custom/input/form-textarea";
import FormMultiInput from "@/components/custom/input/form-multi-input";
import NonFormInput from "@/components/custom/input/non-form-input";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { InsertPostTravelReportAction } from "@/app/actions/PostTravelAction";
import { useSupabaseSession } from "@/hooks/use-session";
import { validateImages } from "@/utils/helpers/validateImages";
import { postTravelReportSchema, PostTravelReportFormData } from "./post-travel-form-schema";
import { TravelOrderDropdown } from "../../../../components/custom/dropdown/travel-order-dropdown";
import { TravelDateDropdown } from "../../../../components/custom/dropdown/travel-date-dropdown";
import ImageCaptureForm from "../../../../components/custom/forms/image-report-form";
import { toast } from "sonner";

type CreatePostTravelFormProps = {
  isAddMode?: boolean;
  values?: PostTravelReportType | null;
};

export function CreatePostTravelForm({
  isAddMode = true,
  values,
}: CreatePostTravelFormProps) {
  const { closeSheet } = useSheet();
  const { openModal, closeModal } = useModal();
  const { data: userData } = useSupabaseSession();

  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedTravelOrderId, setSelectedTravelOrderId] = useState<
    string | null
  >(values?.travel_order_id || null);

  const form = useForm<PostTravelReportFormData>({
    resolver: zodResolver(postTravelReportSchema),
    defaultValues: {
      travel_order_id: values?.travel_order_id || "",
      travel_date_id: values?.travel_date_id || "",
      projects_places_visited: values?.projects_places_visited || "",
      activities_undertaken: values?.activities_undertaken || "",
      issues_concern: values?.issues_concern
        ? Array.isArray(values.issues_concern)
          ? values.issues_concern
          : typeof values.issues_concern === "string"
          ? values.issues_concern.split(", ").filter(Boolean)
          : [values.issues_concern]
        : [],
      remarks: values?.remarks || "",
    },
  });

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: PostTravelReportFormData & { images: ImageData[] }) =>
      await InsertPostTravelReportAction({
        travel_order_id: data.travel_order_id,
        travel_date_id: data.travel_date_id,
        projects_places_visited: data.projects_places_visited,
        activities_undertaken: data.activities_undertaken,
        issues_concern: data.issues_concern?.join(", ") || "",
        remarks: data.remarks,
        images: data.images.map((img) => ({ file: img.file })),
      }),
    invalidateKeys: ["post_travel_reports"],
  });

  const onSubmit = async (data: PostTravelReportFormData) => {
    try {
      const cleanedData = {
        ...data,
        issues_concern: (data.issues_concern || []).filter((item) => item !== ""),
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
          const errorMessage = error?.message || error?.toString() || "Failed to submit post-travel report. Please try again.";
          toast.error(errorMessage);
          console.error("Error submitting post-travel report:", error);
        },
      });
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      console.error("Error in form submission:", error);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto h-[calc(90vh)] pb-12">
        <ImageCaptureForm
          isAddMode={isAddMode}
          values={values}
          images={images}
          setImages={setImages}
          enableOverlay={false}
        />
        <form
          className="space-y-3 p-2 border-t pt-4 mb-4"
          id="post-travel-report-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {isAddMode ? (
            <>
              <TravelOrderDropdown
                form={form}
                onTravelOrderSelect={(id: string) => setSelectedTravelOrderId(id)}
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
                defaultValue={values?.travel_order?.user ? (Array.isArray(values.travel_order.user) ? values.travel_order.user[0]?.fullname : values.travel_order.user?.fullname) : userData?.user?.email}
                readOnly
              />
              <NonFormInput
                label="Travel Order No:"
                defaultValue={values?.travel_order?.travel_order_no}
                readOnly
              />
              <NonFormInput
                label="Inclusive Date of Travel:"
                defaultValue={values?.travel_date?.date}
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
          <FormInput
            label="Activities Undertaken:"
            name="activities_undertaken"
            form={form}
            readOnly={!isAddMode}
          />
          <FormMultiInput
            label="Issues / Concerns / Project % Accomplishment To Date:"
            name="issues_concern"
            form={form}
            values={values?.issues_concern ? (Array.isArray(values.issues_concern) ? values.issues_concern : typeof values.issues_concern === "string" ? values.issues_concern.split(", ").filter(Boolean) : [values.issues_concern]) : null}
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
                    form.handleSubmit(onSubmit)();
                    closeModal();
                  }}
                >
                  Confirm
                </Button>
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
      </CustomSheetFooter>
    </>
  );
}

// Export for view mode
export function PostTravelForm({ data }: { data: PostTravelReportType | null }) {
  return <CreatePostTravelForm isAddMode={false} values={data} />;
}
