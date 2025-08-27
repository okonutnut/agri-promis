"use client";

import PostActivityReportTemplate from "@/components/custom/pdf/post-activity-reports-document";
import GenerateReport from "@/components/custom/print/generate-report";
import { useSelectAllMonitoringReportsByCurrentUserHook } from "@/components/hooks";
import { Loader2 } from "lucide-react";

export default function GeneratePostActivityReport() {
  const { data, isLoading, error } =
    useSelectAllMonitoringReportsByCurrentUserHook();
  if (!data) return null;
  if (error) return null;
  if (isLoading) return <Loader2 className="animate-spin h-4 w-4" />;
  return (
    <GenerateReport
      btnName="Post Activity Report"
      data={<PostActivityReportTemplate data={data ?? []} />}
    />
  );
}
