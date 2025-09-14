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
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllMonitoringReportsByProjectIDAndUserAction } from "@/app/actions/MonitoringAction";
import { SelectProjectDetailsByProjectIDAction } from "@/app/actions/ProjectAction";
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
      "View Monitoring Report",
      <UploadFieldReportForm isAddMode={false} isDraft={false} values={row} />
    );
  };

  const handleAdd = () => {
    openSheet(
      "Upload Monitoring Report",
      <UploadFieldReportForm isAddMode={true} isDraft={false} values={null} />
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
    queryKey: ["project-details"],
    queryFn: () => SelectProjectDetailsByProjectIDAction(projectID as string),
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

    if (
      startDate &&
      endDate &&
      !isNaN(startDate.getTime()) &&
      !isNaN(endDate.getTime()) &&
      currentDate >= startDate &&
      currentDate <= endDate
    ) {
      return true;
    }
    return false;
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
    queryKey: ["monitoring-report"],
    queryFn: () =>
      SelectAllMonitoringReportsByProjectIDAndUserAction(projectID as string),
    table: "monitoring",
  });

  return (
    <CustomPageLayout
      pageTitle="Monitoring Reports"
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
