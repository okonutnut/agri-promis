"use client";

import MonitoringReportReactPDF from "@/components/print-templates/monitoring-report-react-pdf";
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
      document={<MonitoringReportReactPDF data={data} />}
      fileNamePrefix="monitoring-report"
      printBtnName={btnName}
      variant={variant}
      size={size}
    />
  );
}
