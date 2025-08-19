"use client";

import MyDocument from "@/components/custom/pdf/monitoring-reports-document";
import { MonitoringReportType } from "@/components/types";
import { PDFViewer } from "@react-pdf/renderer";

type MonitoringReportsPDFProps = {
  data: MonitoringReportType;
};
export default function MonitoringReportsPDF({
  data,
}: MonitoringReportsPDFProps) {
  return (
    <PDFViewer className="min-h-screen w-full">
      <MyDocument data={data} />
    </PDFViewer>
  );
}
