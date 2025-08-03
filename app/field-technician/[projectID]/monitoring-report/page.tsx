"use client";

import { useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSelectAllMonitoringReportsByProjectIDAndUserHook } from "@/components/hooks";
import { MonitoringReportType } from "@/components/types";
import UserPageLayout from "@/components/custom/layout/user-page-layout";
import UploadFieldReportForm from "./form/monitoring-report-form";
import { useParams } from "next/navigation";
import ViewDraftsSheet from "./components/view-drafts-sheet";

export default function MonitoringReportPage() {
  const { projectID } = useParams();

  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MonitoringReportType | null>(
    null
  );
  const [isAddMode, setIsAddMode] = useState(false);

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
    setIsAddMode(true);
    setPanelOpen(true);
  };

  const handlePanelClose = () => {
    setPanelOpen(false);
    setIsAddMode(false);
    setSelectedRow(null);
  };

  const { data, isLoading, error } =
    useSelectAllMonitoringReportsByProjectIDAndUserHook(projectID as string);

  return (
    <UserPageLayout
      pageTitle="My Monitoring Reports"
      isLoading={isLoading}
      error={error}
      topRightComponent={<ViewDraftsSheet handleModify={handleModify} />}
    >
      <DataTable
        columns={columns}
        data={data || []}
        onRowSelect={handleRowSelect}
        onAdd={handleAdd}
      />
      <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
        <SheetContent className="w-screen md:max-w-xl">
          <UploadFieldReportForm isAddMode={isAddMode} values={selectedRow} />
        </SheetContent>
      </Sheet>
    </UserPageLayout>
  );
}
