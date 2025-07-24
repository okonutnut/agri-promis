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
import { useSelectAllPostActivityReportsByUserHook } from "@/components/hooks";
import { useParams } from "next/navigation";
import { PostActivityReportType } from "@/components/types";
import PostActivityReportForm from "./components/post-activity-report-form";
import UserPageLayout from "@/components/custom/layout/user-page-layout";

export default function FieldTechnicianPage() {
  const { projectID } = useParams();

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

  const { data, isLoading, error } =
    useSelectAllPostActivityReportsByUserHook();

  return (
    <UserPageLayout
      pageTitle="My Post Activity Reports"
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
            <SheetContent className="w-screen md:min-w-xl">
              <SheetHeader className="border-b">
                <SheetTitle className="text-primary uppercase">
                  {isAddMode
                    ? "Upload New Post Activity Report"
                    : "View Post Activity Report Details"}
                </SheetTitle>
              </SheetHeader>
              <PostActivityReportForm values={selectedRow} />
            </SheetContent>
          </Sheet>
        </>
      )}
    </UserPageLayout>
  );
}
