"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { FieldReportsForm } from "./components/field-reports-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { MonitoringReportType } from "@/components/types";
import { useSelectAllMonitoringReportsByProjectIDHook } from "@/components/hooks";

export default function MonitoringReportPage() {
  const { projectID } = useParams();
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MonitoringReportType | null>(
    null
  );

  const handleRowSelect = (row: MonitoringReportType) => {
    setSelectedRow(row);
    setPanelOpen(true);
  };

  const handlePanelClose = () => {
    setPanelOpen(false);
    setSelectedRow(null);
  };

  const { data, isLoading, error, refetch } =
    useSelectAllMonitoringReportsByProjectIDHook(projectID as string);

  // Refetch data when projectID changes
  useEffect(() => {
    refetch();
  }, [refetch, projectID]);

  return (
    <CustomPageLayout
      pageTitle="Monitoring Reports"
      navItems={getProjectNavItems(projectID as string)}
      isLoading={isLoading}
      error={error}
    >
      <DataTable
        columns={columns}
        data={data || []}
        onRowSelect={handleRowSelect}
      />
      <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
        <SheetContent className="w-screen md:min-w-2xl overflow-y-auto">
          <FieldReportsForm data={selectedRow} />
        </SheetContent>
      </Sheet>
    </CustomPageLayout>
  );
}
