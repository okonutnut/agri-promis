"use client";

import { Button } from "@/components/ui/button";
import NonFormInput from "@/components/custom/input/non-form-input";
import {
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useInsertRemarksInMonitoringReportHook } from "@/components/hooks";
import { MonitoringReportType } from "@/components/types";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import NonFormMultiInput from "@/components/custom/input/non-form-multi-input";
import ImageCarousel from "@/components/custom/images/image-carousel";
import PrintMonitoringButton from "@/app/field-technician/projects/[projectID]/monitoring-report/components/print-monitoring";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextarea from "@/components/custom/input/form-textarea";
import NonFormTextarea from "@/components/custom/input/non-form-textarea";

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

  const { mutate, isPending, isSuccess } =
    useInsertRemarksInMonitoringReportHook(data?.id as string);
  const onSubmit = () => mutate(form.getValues("remarks"));

  useEffect(() => {
    if (isSuccess) {
      closeButtonRef.current?.click();
    }
  }, [isSuccess, closeButtonRef]);

  return (
    <>
      <SheetHeader className="border-b flex-row justify-between items-start">
        <SheetTitle className="uppercase text-primary">
          View Field Report
        </SheetTitle>
        <PrintMonitoringButton data={data} />
      </SheetHeader>
      <section className="space-y-4 h-[calc(100vh)] overflow-y-auto overflow-x-hidden">
        <ImageCarousel images={data?.photo_url || []} />
        {data?.created_at && (
          <span className="italic text-xs text-muted-foreground mb-4">
            Date Submitted: {format(new Date(data.created_at), "PPp")}
          </span>
        )}
        <div className="p-2 space-y-4 border-t">
          <NonFormInput
            label="Reporter Name"
            defaultValue={data?.reporter?.fullname}
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
          <FormTextarea
            label="Remarks"
            form={form}
            name="remarks"
            readonly={data?.remarks ? true : false}
          />
        </div>
      </section>
      <SheetFooter className="border-t flex-row justify-end p-2">
        <SheetClose asChild>
          <Button variant="outline" ref={closeButtonRef} size={"sm"}>
            Close
          </Button>
        </SheetClose>
        {(!data?.reviewed_by_id || !data.remarks) && (
          <Button
            onClick={() => onSubmit()}
            variant={isPending ? "ghost" : "default"}
            size={"sm"}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Review Report"}
          </Button>
        )}
      </SheetFooter>
    </>
  );
}
