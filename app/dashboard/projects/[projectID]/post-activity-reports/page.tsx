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
import { PostActivityReportType } from "@/components/types";

export default function FieldReportsPage() {
  const { projectID } = useParams();
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PostActivityReportType | null>(
    null
  );

  const handleRowSelect = (row: PostActivityReportType) => {
    setSelectedRow(row);
    setPanelOpen(true);
  };

  const handlePanelClose = () => {
    setPanelOpen(false);
    setSelectedRow(null);
  };

  return (
    <CustomPageLayout
      pageTitle="Post Activity Reports"
      navItems={getProjectNavItems(projectID as string)}
    >
      <DataTable columns={columns} data={[]} onRowSelect={handleRowSelect} />
      <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
        <SheetContent className="md:min-w-[600px] min-w-screen overflow-y-scroll">
          <SheetHeader>
            <SheetTitle className="uppercase text-primary">
              View Field Report
            </SheetTitle>
          </SheetHeader>
          <Separator />
          <FieldReportsForm key={selectedRow?.id} data={selectedRow} />
        </SheetContent>
      </Sheet>
    </CustomPageLayout>
  );
}
