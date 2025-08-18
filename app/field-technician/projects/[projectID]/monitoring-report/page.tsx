"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSelectAllMonitoringReportsByProjectIDAndUserHook } from "@/components/hooks";
import { MonitoringReportType } from "@/components/types";
import { useParams } from "next/navigation";
import { getUserProjectNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
const UploadFieldReportForm = dynamic(
  () => import("./form/monitoring-report-form"),
  {
    ssr: false,
  }
);
const ViewDraftsSheet = dynamic(
  () => import("./components/view-drafts-sheet"),
  {
    ssr: false,
  }
);

export default function MonitoringReportPage() {
  const { projectID } = useParams();

  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MonitoringReportType | null>(
    null
  );
  const [isAddMode, setIsAddMode] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const handleRowSelect = (row: MonitoringReportType) => {
    setSelectedRow(row);
    setIsAddMode(false);
    setPanelOpen(true);
  };

  const handleAdd = () => {
    setSelectedRow(null);
    setIsAddMode(true);
    setPanelOpen(true);
  };

  const handleModify = (row: MonitoringReportType | null) => {
    setSelectedRow(row);
    setIsDraft(true);
    setIsAddMode(true);
    setPanelOpen(true);
  };

  const handlePanelClose = useCallback(() => {
    setPanelOpen(false);
    setIsAddMode(false);
    setIsDraft(false);
    setSelectedRow(null);
  }, []);

  const { data, isLoading, error } =
    useSelectAllMonitoringReportsByProjectIDAndUserHook(projectID as string);

  return (
    <CustomPageLayout
      pageTitle="My Monitoring Reports"
      isLoading={isLoading}
      error={error}
      navItems={getUserProjectNavItems(projectID as string)}
      topRightComponent={<ViewDraftsSheet handleModify={handleModify} />}
      role="user"
    >
      <DataTable
        columns={columns}
        data={data || []}
        onRowSelect={handleRowSelect}
        onAdd={handleAdd}
      />
      <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
        <SheetContent className="w-screen md:max-w-4xl">
          <UploadFieldReportForm
            isAddMode={isAddMode}
            isDraft={isDraft}
            values={selectedRow}
            onOpenChange={handlePanelClose}
          />
        </SheetContent>
      </Sheet>
    </CustomPageLayout>
  );
}
