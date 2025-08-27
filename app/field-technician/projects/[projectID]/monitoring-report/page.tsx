"use client";

import dynamic from "next/dynamic";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { useSelectAllMonitoringReportsByProjectIDAndUserHook } from "@/components/hooks";
import { MonitoringReportType } from "@/components/types";
import { useParams } from "next/navigation";
import { getUserProjectNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";

const UploadFieldReportForm = dynamic(
  () => import("./form/monitoring-report-form"),
  { ssr: false }
);
const ViewDraftsSheet = dynamic(
  () => import("./components/view-drafts-sheet"),
  { ssr: false }
);

function MonitoringReportContent({
  data,
}: {
  data: MonitoringReportType[] | undefined;
}) {
  const { openSheet, closeSheet } = useSheet();

  const handleRowSelect = (row: MonitoringReportType) => {
    openSheet(
      "View Monitoring Report",
      <UploadFieldReportForm
        isAddMode={false}
        isDraft={false}
        values={row}
        onOpenChange={closeSheet}
      />
    );
  };

  const handleAdd = () => {
    openSheet(
      "Add Monitoring Report",
      <UploadFieldReportForm
        isAddMode={true}
        isDraft={false}
        values={null}
        onOpenChange={closeSheet}
      />
    );
  };

  const handleModify = (row: MonitoringReportType | null) => {
    openSheet(
      "Modify Draft Report",
      <UploadFieldReportForm
        isAddMode={true}
        isDraft={true}
        values={row}
        onOpenChange={closeSheet}
      />
    );
  };

  if (!data) return null;

  return (
    <DataTable
      columns={columns}
      data={data || []}
      onRowSelect={handleRowSelect}
      onAdd={handleAdd}
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
      <MonitoringReportContent data={data ?? undefined} />
    </CustomPageLayout>
  );
}
