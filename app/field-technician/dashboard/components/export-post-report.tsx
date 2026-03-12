"use client";

import PostActivityReportTemplate from "@/components/print-templates/post-activity-reports-document";
import PrintDownloadButton from "@/components/custom/print/print-download-button";
import { useSelectAllMonitoringReportsByCurrentUserHook } from "@/components/hooks";
import { Loader2 } from "lucide-react";

export default function GeneratePostActivityReport() {
  const { data, isLoading, error } =
    useSelectAllMonitoringReportsByCurrentUserHook();
  if (!data) return null;
  if (error) return null;
  if (isLoading) return <Loader2 className="animate-spin h-4 w-4" />;
  return (
    <PrintDownloadButton
      printBtnName="Post Activity Report"
      document={<PostActivityReportTemplate data={data ?? []} />}
      fileNamePrefix="post-activity-report"
    />
  );
}
