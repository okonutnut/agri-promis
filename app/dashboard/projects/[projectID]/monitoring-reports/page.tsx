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
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllMonitoringReportsByProjectIDAction } from "@/app/actions/MonitoringAction";

type MonitoringReportContentProps = {
  data: MonitoringReportType[] | undefined;
};
function MonitoringReportContent({ data }: MonitoringReportContentProps) {
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

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["monitoring-reports"],
    queryFn: () =>
      SelectAllMonitoringReportsByProjectIDAction(projectID as string),
    table: "monitoring",
  });

  console.log("Monitoring Reports Data:", data);

  return (
    <CustomPageLayout
      pageTitle="Monitoring Reports"
      pageDescription="View and manage monitoring reports for the project."
      navItems={getProjectNavItems(projectID as string)}
      isLoading={isLoading}
      error={error}
    >
      <MonitoringReportContent data={data ?? undefined} />
    </CustomPageLayout>
  );
}
