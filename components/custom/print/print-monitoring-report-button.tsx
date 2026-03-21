"use client";

import MonitoringReportDocument from "@/components/print-templates/monitoring-reports-document";
import { MonitoringReportType } from "@/components/types";
import PrintDownloadButton from "@/components/custom/print/print-download-button";

type PrintMonitoringReportButtonProps = {
  data: MonitoringReportType;
  btnName?: string;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
};

export default function PrintMonitoringReportButton({
  data,
  btnName = "Print",
  variant = "outline",
  size = "sm",
}: PrintMonitoringReportButtonProps) {
  return (
    <PrintDownloadButton
      document={<MonitoringReportDocument data={data} />}
      fileNamePrefix="monitoring-report"
      printBtnName={btnName}
      variant={variant}
      size={size}
    />
  );
}
