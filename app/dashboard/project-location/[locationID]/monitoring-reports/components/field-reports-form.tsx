"use client";

import { MonitoringReportType } from "@/components/types";
import { useSheet } from "@/components/custom/layout/custom-page-layout";
import { GenericReportForm } from "@/components/custom/forms/generic-report-form";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { InsertRemarksInMonitoringReportAction } from "@/app/actions/MonitoringAction";
import { toast } from "sonner";

type FieldReportsFormProps = {
  data: MonitoringReportType | null;
};

export function FieldReportsForm({ data }: FieldReportsFormProps) {
  const { closeSheet } = useSheet();

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (reportID: string) =>
      InsertRemarksInMonitoringReportAction(reportID),
    invalidateKeys: [
      "allMonitoringReportsByProjectId",
      "allMonitoringReportsByUser",
      "monitoring-reports",
      data?.project_location_id as string,
    ],
    onSuccess: () => {
      toast.success("Monitoring report reviewed successfully");
      closeSheet();
    },
    onError: () => {
      toast.error("Failed to review monitoring report");
    },
  });

  return (
    <GenericReportForm
      type="monitoring"
      isAddMode={false}
      isDraft={false}
      values={data}
      mutationFn={async () => {}}
      invalidateKeys={["monitoring_reports"]}
      onSuccess={async () => closeSheet()}
      onRemarkReview={() => data?.id && mutate(data.id)}
      remarkReviewIsPending={isPending}
      showRemarkReviewButton={!data?.reviewed_by_id}
    />
  );
}
