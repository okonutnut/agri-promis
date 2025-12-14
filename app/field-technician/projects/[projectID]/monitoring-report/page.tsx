"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { MonitoringReportType } from "@/components/types";
import { useParams } from "next/navigation";
import { getUserProjectNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useMemo } from "react";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllMonitoringReportsByProjectIDAndUserAction } from "@/app/actions/MonitoringAction";
import { SelectProjectDetailsByProjectLocationIDAction } from "@/app/actions/ProjectAction";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import UploadFieldReportForm from "./form/monitoring-report-form";
import ViewDraftsSheet from "./components/view-drafts-sheet";

type MonitoringReportContentType = {
  data: MonitoringReportType[] | undefined;
  projectID?: string;
};

function MonitoringReportContent({
  data,
  projectID,
}: MonitoringReportContentType) {
  const { openSheet } = useSheet();

  const handleRowSelect = (row: MonitoringReportType) => {
    openSheet(
      "View Report",
      <UploadFieldReportForm isAddMode={false} isDraft={false} values={row} />
    );
  };

  const handleAdd = () => {
    openSheet(
      "Upload Monitoring Report",
      <UploadFieldReportForm
        isAddMode={true}
        isDraft={false}
        values={null}
      />
    );
  };

  const handleModify = (row: MonitoringReportType | null) => {
    openSheet(
      "Modify Report Draft",
      <UploadFieldReportForm isAddMode={true} isDraft={true} values={row} />
    );
  };

  if (!data) return <SkeletonLoading />;

  const { data: projectData } = useRealtimeQuery({
    queryKey: ["project-details", projectID as string],
    queryFn: () =>
      SelectProjectDetailsByProjectLocationIDAction(projectID as string),
    table: "projects",
  });

  const isEnabledReports = useMemo(() => {
    const currentDate = new Date();
    const startDate = projectData?.start_date
      ? new Date(projectData.start_date)
      : null;
    const endDate = projectData?.end_date
      ? new Date(projectData.end_date)
      : null;
    // If startDate is not present or invalid, reports cannot be enabled.
    if (!startDate || isNaN(startDate.getTime())) return false;

    // If start date is in the future, don't enable reports yet.
    if (startDate > currentDate) return false;

    // If endDate is null (nullable) or invalid, treat the project as open-ended
    // and enable reports as long as currentDate >= startDate.
    if (!endDate || isNaN(endDate.getTime())) {
      return currentDate >= startDate;
    }

    // Both dates valid: enable when current is between start and end.
    return currentDate >= startDate && currentDate <= endDate;
  }, [projectData]);

  return (
    <DataTable
      columns={columns}
      data={data || []}
      onRowSelect={handleRowSelect}
      onAdd={handleAdd}
      enableUpload={isEnabledReports}
      topLeftComponent={<ViewDraftsSheet handleModify={handleModify} />}
    />
  );
}

export default function MonitoringReportPage() {
  const { projectID } = useParams();
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["monitoring-report", projectID as string],
    queryFn: () =>
      SelectAllMonitoringReportsByProjectIDAndUserAction(projectID as string),
    table: "monitoring",
  });

  return (
    <CustomPageLayout
      pageTitle="Monitoring Report"
      pageDescription="View all submitted reports for this project."
      isLoading={isLoading}
      error={error}
      navItems={getUserProjectNavItems(projectID as string)}
      role="user"
    >
      <MonitoringReportContent
        data={data ?? undefined}
        projectID={projectID as string}
      />
    </CustomPageLayout>
  );
}
