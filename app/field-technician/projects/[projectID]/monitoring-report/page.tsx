"use client";

import dynamic from "next/dynamic";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import {
  useSelectAllMonitoringReportsByProjectIDAndUserHook,
  useSelectProjectDetailsHook,
} from "@/components/hooks";
import { MonitoringReportType } from "@/components/types";
import { useParams } from "next/navigation";
import { getUserProjectNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useMemo } from "react";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
const UploadFieldReportForm = dynamic(
  () => import("./form/monitoring-report-form"),
  { ssr: false }
);
const ViewDraftsSheet = dynamic(
  () => import("./components/view-drafts-sheet"),
  { ssr: false }
);

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

  const { data: projectData } = useSelectProjectDetailsHook(
    projectID as string
  );

  const isEnabledReports = useMemo(() => {
    const currentDate = new Date().toDateString();
    if (
      projectData?.start_date &&
      projectData?.end_date &&
      currentDate >= new Date(projectData.start_date).toDateString() &&
      currentDate <= new Date(projectData.end_date).toDateString()
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
  const { data, isLoading, error } =
    useSelectAllMonitoringReportsByProjectIDAndUserHook(projectID as string);

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
