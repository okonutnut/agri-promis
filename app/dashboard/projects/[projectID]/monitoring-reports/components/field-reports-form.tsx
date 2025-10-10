"use client";

import NonFormInput from "@/components/custom/input/non-form-input";
import { MonitoringReportType } from "@/components/types";
import NonFormMultiInput from "@/components/custom/input/non-form-multi-input";
import NonFormTextarea from "@/components/custom/input/non-form-textarea";
import dynamic from "next/dynamic";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import { useInsertRemarksInMonitoringReportHook } from "@/components/hooks";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import MonitoringReportDocument from "@/components/custom/pdf/monitoring-reports-document";
import PrintDownloadDropdown from "@/components/custom/print/print-download-dropdown";
import { useEffect } from "react";
const ImageCarousel = dynamic(
  () => import("@/components/custom/images/image-carousel"),
  { ssr: false }
);

type FieldReportsFormProps = {
  data: MonitoringReportType | null;
};
export function FieldReportsForm({ data }: FieldReportsFormProps) {
  const { openModal, closeModal } = useModal();
  const { closeSheet } = useSheet();

  const { mutate, isPending, isSuccess } =
    useInsertRemarksInMonitoringReportHook(data?.id as string);

  useEffect(() => {
    if (isSuccess) {
      closeSheet();
    }
  }, [isSuccess]);
  return (
    <>
      <section className="space-y-4 h-[calc(90vh)] overflow-y-auto overflow-x-hidden">
        <ImageCarousel images={data?.photo_url || []} />
        <div className="p-2 space-y-4 border-t">
          <NonFormInput
            label="Reporter Name"
            defaultValue={data?.reporter?.fullname}
            readOnly
          />
          <NonFormInput
            label="Travel Order No"
            defaultValue={data?.travel_order?.travel_order_no}
            readOnly
          />
          <NonFormInput label="Purpose" defaultValue={data?.purpose} readOnly />
          <NonFormMultiInput label="Findings" values={data?.findings} />
          <NonFormTextarea
            label="Observation"
            defaultValue={data?.observation ?? "N/A"}
            readOnly
          />
          <NonFormMultiInput
            label="Issues / Concern"
            values={data?.issues_concern}
          />
          <NonFormTextarea
            label="Remarks"
            defaultValue={data?.remarks}
            readOnly
          />
        </div>
      </section>
      <CustomSheetFooter isPending={isPending}>
        {!data?.reviewed_by_id ? (
          <Button
            size={"sm"}
            disabled={isPending}
            onClick={() => {
              openModal(
                "Confirm Action",
                "Are you sure you want to submit for review?",
                <Button
                  className="w-full"
                  onClick={() => {
                    mutate();
                    closeModal();
                  }}
                >
                  Confirm
                </Button>
              );
            }}
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
            values={data as MonitoringReportType}
          />
        )}
      </CustomSheetFooter>
    </>
  );
}
