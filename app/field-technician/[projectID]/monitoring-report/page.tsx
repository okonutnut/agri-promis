"use client";

import { useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSelectAllMonitoringReportsByUserHook } from "@/components/hooks";
import { PostActivityReportType } from "@/components/types";
import UserPageLayout from "@/components/custom/layout/user-page-layout";
import MonitoringReportForm from "./components/image-report-form";

export default function MonitoringReportPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PostActivityReportType | null>(
    null
  );
  const [isAddMode, setIsAddMode] = useState(false);

  const handleRowSelect = (row: PostActivityReportType) => {
    setSelectedRow(row);
    setIsAddMode(false);
    setPanelOpen(true);
  };

  const handleAdd = () => {
    setSelectedRow(null);
    setIsAddMode(true);
    setPanelOpen(true);
  };

  const handlePanelClose = () => {
    setPanelOpen(false);
    setIsAddMode(false);
    setSelectedRow(null);
  };

  const { data, isLoading, error } = useSelectAllMonitoringReportsByUserHook();
  console.log("Monitoring Reports Data:", data);

  return (
    <UserPageLayout
      pageTitle="My Monitoring Reports"
      isLoading={isLoading}
      error={error}
    >
      {data && (
        <>
          <DataTable
            columns={columns}
            data={data}
            onRowSelect={handleRowSelect}
            onAdd={handleAdd}
          />
          <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
            <SheetContent className="flex justify-between w-screen md:max-w-xl">
              <SheetHeader className="border-b">
                <SheetTitle className="text-primary uppercase">
                  {isAddMode
                    ? "Upload New Post Activity Report"
                    : "View Post Activity Report Details"}
                </SheetTitle>
              </SheetHeader>
              <MonitoringReportForm
                values={selectedRow}
                isAddMode={isAddMode}
              />
            </SheetContent>
          </Sheet>
        </>
      )}
    </UserPageLayout>
  );
}
