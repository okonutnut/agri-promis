import FormTextarea from "@/components/custom/input/form-textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "@/components/custom/input/form-input";
import { Button } from "@/components/ui/button";
import { SheetFooter, SheetClose } from "@/components/ui/sheet";
import { useParams } from "next/navigation";
import {
  useInsertPostActivityRemarksHook,
  useInsertPostActivityReportHook,
} from "@/components/hooks";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { PostActivityReportType } from "@/components/types";
import { format } from "date-fns";

const formSchema = z.object({
  id: z.string().min(1, "ID is required"),
  travel_order_no: z
    .string()
    .min(1, "Travel Order No. is required")
    .max(500, "Travel Order No. must not exceed 500 characters"),
  inclusive_date_of_travel: z
    .string()
    .refine((value) => !isNaN(new Date(value).getTime()), {
      message: "Inclusive Date of Travel is required",
    }),
  project_id: z.string().min(1, "Project ID is required"),
  activities_undertaken: z.string().min(1, "Activities Undertaken is required"),
  issues_concern_accomplishment: z
    .string()
    .min(1, "Issues/Concerns/Accomplishments is required"),
  remarks: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value === undefined || value.trim() === "") {
          return true; // Allow empty remarks
        }
        return value.trim().length >= 5;
      },
      {
        message: "Remarks must be at least 5 characters if provided",
      }
    ),
});
type formData = z.infer<typeof formSchema>;

type PostActivityReportFormProps = {
  values: PostActivityReportType | null;
  isAdmin?: boolean;
};
export default function PostActivityReportForm({
  values,
  isAdmin,
}: PostActivityReportFormProps) {
  const { projectID } = useParams();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: values?.id || "",
      project_id: projectID as string,
      travel_order_no: values?.travel_order_no || "",
      inclusive_date_of_travel: values?.inclusive_date_of_travel || "",
      activities_undertaken: values?.activities_undertaken || "",
      issues_concern_accomplishment:
        values?.issues_concern_accomplishment || "",
      remarks: values?.remarks || "",
    },
  });

  // INSERT
  const {
    mutate: insertPostActivityReport,
    isPending,
    isSuccess,
  } = useInsertPostActivityReportHook();

  // UPDATE
  const {
    mutate: updateRemarks,
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
  } = useInsertPostActivityRemarksHook();

  const onSubmit = (data: formData) => {
    if (isAdmin) {
      updateRemarks(data);
    } else {
      insertPostActivityReport(data);
    }
  };

  useEffect(() => {
    if (closeButtonRef.current) {
      if (isSuccess || isUpdateSuccess) {
        form.reset();
        closeButtonRef.current.click();
      }
    }
  }, [isSuccess, isUpdateSuccess, form]);

  return (
    <>
      {values?.created_at && (
        <span className="italic text-xs text-muted-foreground mx-2">
          Date Submitted: {format(new Date(values.created_at), "PPp")}
        </span>
      )}
      <form
        className="overflow-y-auto space-y-4 p-2 h-full"
        id="upload-post-activity-report-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          form={form}
          label="Travel Order No."
          name="travel_order_no"
          readonly={!!values}
        />
        <FormInput
          form={form}
          label="Inclusive Date of Travel"
          name="inclusive_date_of_travel"
          type="date"
          readonly={!!values}
        />
        <FormTextarea
          form={form}
          label="Activities Undertaken"
          name="activities_undertaken"
          readonly={!!values}
        />
        <FormTextarea
          form={form}
          label="Issues/Concerns/Accomplishments"
          name="issues_concern_accomplishment"
          readonly={!!values}
        />
        <FormTextarea
          form={form}
          label="Remarks"
          name="remarks"
          readonly={!isAdmin || !!values?.remarks}
          noPlaceholder
        />
      </form>
      <SheetFooter className="border-t">
        {!values?.remarks && isAdmin && (
          <Button
            form="upload-post-activity-report-form"
            variant={isPending || isUpdating ? "ghost" : "default"}
            disabled={isPending || isUpdating}
          >
            {isPending || isUpdating ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        )}
        <SheetClose asChild>
          <Button ref={closeButtonRef} variant="outline">
            Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
}
