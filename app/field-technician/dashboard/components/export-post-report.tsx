"use client";

import PostActivityReportTemplate from "@/components/custom/pdf/post-activity-reports-document";
import GenerateReport from "@/components/custom/print/generate-report";
import { useSelectAllMonitoringReportsByCurrentUserHook } from "@/components/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export default function GeneratePostActivityReport() {
  const { data, isLoading, error } =
    useSelectAllMonitoringReportsByCurrentUserHook();
  console.log(data);
  if (isLoading) return <Skeleton className="w-[50px] h-5" />;
  if (error) return <></>;
  return (
    <GenerateReport
      btnName="Post Activity Report"
      data={<PostActivityReportTemplate data={data ?? []} />}
    />
  );
}
