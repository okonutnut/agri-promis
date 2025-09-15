"use client";

import { Button } from "@/components/ui/button";
import NonFormInput from "@/components/custom/input/non-form-input";
import { useInsertRemarksInMonitoringReportHook } from "@/components/hooks";
import { MonitoringReportType } from "@/components/types";
import { Loader2, Send } from "lucide-react";
import { useRef } from "react";
import NonFormMultiInput from "@/components/custom/input/non-form-multi-input";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextarea from "@/components/custom/input/form-textarea";
import NonFormTextarea from "@/components/custom/input/non-form-textarea";
import dynamic from "next/dynamic";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import MonitoringReportDocument from "@/components/custom/pdf/monitoring-reports-document";
import PrintDownloadDropdown from "@/components/custom/print/print-download-dropdown";
const ImageCarousel = dynamic(
  () => import("@/components/custom/images/image-carousel"),
  { ssr: false }
);
const formSchema = z.object({
  remarks: z
    .string()
    .min(5, "Remarks must be at least 5 characters")
    .max(700, "Remarks must not exceed 700 characters"),
});
type formDataType = z.infer<typeof formSchema>;

type FieldReportsFormProps = {
  data: MonitoringReportType | null;
};
export function FieldReportsForm({ data }: FieldReportsFormProps) {
  const form = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remarks: data?.remarks || "",
    },
  });
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate, isPending } = useInsertRemarksInMonitoringReportHook(
    data?.id as string
  );

  const onSubmit = (formData: formDataType) =>
    mutate(formData.remarks, {
      onSuccess: () => {
        form.reset();
        closeButtonRef.current?.click();
      },
    });

  return (
    <>
      <section className="space-y-4 h-[calc(90vh)] overflow-y-auto overflow-x-hidden">
        <ImageCarousel images={data?.photo_url || []} />
        <div className="p-2 space-y-4 border-t">
          <NonFormInput
            label="Reporter Name"
            defaultValue={data?.reporter?.fullname}
            readonly
          />
          <NonFormInput
            label="Travel Order No"
            defaultValue={data?.travel_order?.travel_order_no}
            readonly
          />
          <NonFormInput label="Purpose" defaultValue={data?.purpose} readonly />
          <NonFormMultiInput label="Findings" values={data?.findings} />
          <NonFormTextarea
            label="Observation"
            defaultValue={data?.observation ?? "N/A"}
            readonly
          />
          <NonFormMultiInput
            label="Issues / Concern"
            values={data?.issues_concern}
          />
          <form id="remarks-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormTextarea
              label="Remarks"
              form={form}
              name="remarks"
              readonly={data?.reviewed_by_id ? true : false}
              noPlaceholder={data?.reviewed_by_id ? true : false}
            />
          </form>
        </div>
      </section>
      <CustomSheetFooter>
        {!data?.reviewed_by_id ? (
          <Button
            form="remarks-form"
            variant={isPending ? "ghost" : "default"}
            size={"sm"}
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Send />
                Review
              </>
            )}
          </Button>
        ) : (
          <PrintDownloadDropdown
            data={<MonitoringReportDocument data={data} />}
          />
        )}
      </CustomSheetFooter>
    </>
  );
}
