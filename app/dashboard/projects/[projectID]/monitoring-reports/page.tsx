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
import { useSelectAllFieldReportsByProjectIDHook } from "@/components/hooks";
import { FieldReportType } from "@/components/types";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { getProjectNavItems } from "@/components/sidebar/navitems";

export default function FieldReportsPage() {
  const { projectID } = useParams();
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FieldReportType | null>(null);

  const handleRowSelect = (row: FieldReportType) => {
    setSelectedRow(row);
    setPanelOpen(true);
  };

  const handlePanelClose = () => {
    setPanelOpen(false);
    setSelectedRow(null);
  };

  const { data, isLoading, error } = useSelectAllFieldReportsByProjectIDHook(
    projectID as string
  );

  return (
    <CustomPageLayout
      pageTitle="Monitoring Reports"
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(projectID as string)}
    >
      <DataTable
        columns={columns}
        data={data || []}
        onRowSelect={handleRowSelect}
      />
      <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
        <SheetContent className="md:min-w-[600px] min-w-screen overflow-y-scroll">
          <SheetHeader>
            <SheetTitle className="uppercase text-primary">
              View Field Report
            </SheetTitle>
            <Card className="mx-2 shadow-none p-0 gap-0">
              <CardContent className="border-b p-0">
                <Image
                  src={selectedRow?.photo_url || "/placeholder.png"}
                  alt="Field Report"
                  width={500}
                  height={500}
                  className="w-full mx-auto object-contain max-h-[500px]"
                />
              </CardContent>
              <CardFooter className="text-xs flex flex-col items-start gap-2 p-3">
                <span>Location: {selectedRow?.location_name} </span>
                <span>Longtitude: {selectedRow?.longitude} </span>
                <span>Latitude: {selectedRow?.latitude} </span>
                <span>
                  Date &amp; Time Captured:&nbsp;
                  {selectedRow?.date_time_captured
                    ? format(new Date(selectedRow.date_time_captured), "PPpp")
                    : "N/A"}
                </span>
              </CardFooter>
            </Card>
          </SheetHeader>
          <Separator />
          <FieldReportsForm key={selectedRow?.id} data={selectedRow} />
        </SheetContent>
      </Sheet>
    </CustomPageLayout>
  );
}
