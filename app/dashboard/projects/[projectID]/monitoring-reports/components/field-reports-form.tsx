"use client";

import { Button } from "@/components/ui/button";
import NonFormInput from "@/components/custom/input/non-form-input";
import { Textarea } from "@/components/ui/textarea";
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
import { Label } from "@/components/ui/label";
import NonFormMultiInput from "@/components/custom/input/non-form-multi-input";
import ImageCarousel from "@/components/custom/images/image-carousel";
import PrintMonitoringButton from "@/app/field-technician/[projectID]/monitoring-report/components/print-monitoring";
import NonFormTextarea from "@/components/custom/input/non-form-textarea";

type FieldReportsFormProps = {
  data: MonitoringReportType | null;
};
export function FieldReportsForm({ data }: FieldReportsFormProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate, isPending, isSuccess } =
    useInsertRemarksInMonitoringReportHook(data?.id as string);
  const onSubmit = () => mutate();

  useEffect(() => {
    if (isSuccess) {
      closeButtonRef.current?.click();
    }
  }, [isSuccess]);

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
        <div className="px-2 space-y-4 border-t">
          {data?.created_at && (
            <span className="italic text-xs text-muted-foreground mb-4">
              Date Submitted: {format(new Date(data.created_at), "PPp")}
            </span>
          )}
          <NonFormInput
            label="Reporter Name"
            defaultValue={data?.reporter?.fullname}
            readonly
          />
          <NonFormInput label="Purpose" defaultValue={data?.purpose} readonly />
          <NonFormMultiInput label="Findings" values={data?.findings} />
          <Label className="capitalized">Observation</Label>
          <Textarea value={data?.observation} readOnly tabIndex={-1} />
          <NonFormMultiInput
            label="Issues / Concern"
            values={data?.issues_concern}
          />
          <NonFormTextarea
            label="Remarks"
            defaultValue={data?.remarks}
            readonly
          />
        </div>
      </section>
      <SheetFooter className="border-t flex-row justify-end p-2">
        <SheetClose asChild>
          <Button variant="outline" ref={closeButtonRef} size={"sm"}>
            Close
          </Button>
        </SheetClose>
        {!data?.reviewed_by_id && (
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
