"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { FieldReportsForm } from "./components/field-reports-form";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { MonitoringReportType } from "@/components/types";
import { useSelectAllMonitoringReportsByProjectIDHook } from "@/components/hooks";

function MonitoringReportContent({
  data,
}: {
  data: MonitoringReportType[] | undefined;
}) {
  const { openSheet } = useSheet();

  const handleRowSelect = (row: MonitoringReportType) => {
    openSheet(
      "Monitoring Report Details",
      <FieldReportsForm data={row} key={`view-${row.id}`} />
    );
  };

  if (!data) return null;

  return (
    <DataTable
      columns={columns}
      data={data || []}
      onRowSelect={handleRowSelect}
    />
  );
}

export default function MonitoringReportPage() {
  const { projectID } = useParams();
  const { data, isLoading, error } =
    useSelectAllMonitoringReportsByProjectIDHook(projectID as string);

  return (
    <CustomPageLayout
      pageTitle="Monitoring Reports"
      navItems={getProjectNavItems(projectID as string)}
      isLoading={isLoading}
      error={error}
    >
      <MonitoringReportContent data={data ?? undefined} />
    </CustomPageLayout>
  );
}
