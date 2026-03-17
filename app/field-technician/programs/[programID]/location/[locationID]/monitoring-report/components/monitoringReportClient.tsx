"use client";

import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
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
import { CheckUserAssignedToProgramByProjectLocationAction } from "@/app/actions/AssignedProgramAction";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import UploadFieldReportForm from "../form/monitoring-report-form";
import ViewDraftsSheet from "@/components/custom/drafts/view-drafts-sheet";

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

  const { data: isAssignedToProgram } = useRealtimeQuery({
    queryKey: ["user-program-assignment", projectID as string],
    queryFn: () =>
      CheckUserAssignedToProgramByProjectLocationAction(projectID as string),
    table: "assigned_fieldtechnicians",
  });

  const isEnabledReports = useMemo(() => {
    if (!isAssignedToProgram) return false;

    const currentDate = new Date();
    const startDate = projectData?.start_date
      ? new Date(projectData.start_date)
      : null;
    const endDate = projectData?.end_date
      ? new Date(projectData.end_date)
      : null;
    if (!startDate || isNaN(startDate.getTime())) return false;

    if (startDate > currentDate) return false;

    if (!endDate || isNaN(endDate.getTime())) {
      return currentDate >= startDate;
    }

    return currentDate >= startDate && currentDate <= endDate;
  }, [projectData, isAssignedToProgram]);

  return (
    <DataTable
      columns={columns}
      data={data || []}
      onRowSelect={handleRowSelect}
      onAdd={isEnabledReports ? handleAdd : undefined}
      addButtonLabel="New Report"
      toolbarContent={
        isEnabledReports ? (
          <ViewDraftsSheet
            handleModify={handleModify}
            filterFn={(d) => d.project_location_id === projectID}
            getTitle={(d) => d.purpose || "Untitled"}
            getSearchTerms={(d) => [d.purpose ?? "", d.travel_order_no ?? ""]}
          />
        ) : undefined
      }
    />
  );
}

export default function MonitoringReportClient() {
  const { programID, locationID } = useParams();
  
  const { data: isAssignedToProgram, isLoading: isCheckingAccess } = useRealtimeQuery({
    queryKey: ["user-program-assignment-page", locationID as string],
    queryFn: () =>
      CheckUserAssignedToProgramByProjectLocationAction(locationID as string),
    table: "assigned_fieldtechnicians",
  });

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["monitoring-report", locationID as string],
    queryFn: () =>
      SelectAllMonitoringReportsByProjectIDAndUserAction(locationID as string),
    table: "monitoring",
  });

  if (isAssignedToProgram === false && !isCheckingAccess) {
    return (
      <CustomPageLayout
        pageTitle="Access Denied"
        pageDescription="You are not assigned to this program."
        isLoading={false}
        error={null}
        navItems={getUserProjectNavItems(programID as string, locationID as string)}
        role="user"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground">
            You are not assigned to this program. Please contact your administrator.
          </p>
        </div>
      </CustomPageLayout>
    );
  }

  return (
    <CustomPageLayout
      pageTitle="Monitoring Report"
      pageDescription="View all submitted reports for this project."
      isLoading={isLoading || isCheckingAccess}
      error={error}
      navItems={getUserProjectNavItems(programID as string, locationID as string)}
      role="user"
    >
      <MonitoringReportContent
        data={data ?? undefined}
        projectID={locationID as string}
      />
    </CustomPageLayout>
  );
}
