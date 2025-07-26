"use client";

import { useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { FieldReportsForm } from "./components/field-reports-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CustomPageLayout from "@/components/custom/layout/admin-page-layout";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { MonitoringReportType } from "@/components/types";
import { useSelectAllMonitoringReportsByProjectIDHook } from "@/components/hooks";
import ImageCarousel from "@/components/custom/images/image-carousel";

export default function FieldReportsPage() {
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

  const { data, isLoading, error } =
    useSelectAllMonitoringReportsByProjectIDHook(projectID as string);
  console.log("Monitoring Reports Data:", data);
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
        <SheetContent className="w-screen md:min-w-2xl overflow-y-scroll">
          <SheetHeader className="border-b">
            <SheetTitle className="uppercase text-primary">
              View Field Report
            </SheetTitle>
          </SheetHeader>
          <ImageCarousel images={selectedRow?.photo_url || []} />
          <Separator />
          <FieldReportsForm data={selectedRow} />
        </SheetContent>
      </Sheet>
    </CustomPageLayout>
  );
}
