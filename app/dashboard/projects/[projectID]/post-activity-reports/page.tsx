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
import CustomPageLayout from "@/components/custom/layout/admin-page-layout";
import { useParams } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { PostActivityReportType } from "@/components/types";
import { useSelectAllPostActivityReportsByProjectIDHook } from "@/components/hooks";
import PostActivityReportForm from "@/app/field-technician/[projectID]/post-activity-report/components/post-activity-report-form";

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

  const { data, isLoading, error } =
    useSelectAllPostActivityReportsByProjectIDHook(projectID as string);
  console.log("Post Activity Reports Data:", data);

  return (
    <CustomPageLayout
      pageTitle="Post Activity Reports"
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
        <SheetContent className="w-full md:min-w-2xl overflow-y-auto">
          <SheetHeader className="border-b">
            <SheetTitle className="uppercase text-primary">
              View Post Activity Report
            </SheetTitle>
          </SheetHeader>
          <PostActivityReportForm isAdmin values={selectedRow} />
        </SheetContent>
      </Sheet>
    </CustomPageLayout>
  );
}
