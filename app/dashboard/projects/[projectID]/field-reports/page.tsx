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
import CustomPageLayout from "@/components/custom/layout/page-layout";
import { useParams } from "next/navigation";
import { useSelectAllFieldReportsByProjectIDHook } from "@/components/hooks";
import { FieldReportType } from "@/components/types";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

  const { data } = useSelectAllFieldReportsByProjectIDHook(projectID as string);
  console.log("Field Reports Data:", data);

  return (
    <CustomPageLayout>
      <h1 className="text-2xl font-semibold text-primary mb-4">
        Field Reports
      </h1>
      <DataTable
        columns={columns}
        data={data || []}
        onRowSelect={handleRowSelect}
      />
      <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
        <SheetContent className="min-w-[600px] md:min-w-[600px] min-w-screen sm:min-w-[400px] overflow-y-scroll">
          <SheetHeader>
            <SheetTitle className="uppercase text-primary">
              View Field Report
            </SheetTitle>
            <Card className="mx-2 shadow-none">
              <CardContent className="border-b p-0">
                <Image
                  src={selectedRow?.photo_url || "/placeholder.png"}
                  alt="Field Report"
                  width={500}
                  height={500}
                  className="mx-auto mb-4 object-cover rounded-lg"
                />
              </CardContent>
              <CardFooter className="text-xs flex justify-between">
                <span>
                  Longtitude: {selectedRow?.longitude}{" "}
                  <Separator orientation="vertical" />
                </span>
                <span>
                  Latitude: {selectedRow?.latitude}{" "}
                  <Separator orientation="vertical" />
                </span>
                <span>
                  Date &amp; Time: {selectedRow?.report_date},{" "}
                  {selectedRow?.report_time}
                  <Separator orientation="vertical" />
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
