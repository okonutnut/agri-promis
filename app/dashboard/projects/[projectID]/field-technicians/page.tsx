"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSelectFieldTechniciansByProjectIDHook } from "@/components/hooks";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { AssignedProjectsType } from "@/components/types";
import { getProjectNavItems } from "@/components/sidebar/navitems";
const SelectMembersTable = dynamic(
  () => import("./components/members-sheet/select-members-table"),
  {
    ssr: false,
  }
);
const ViewFieldTechnicianPanel = dynamic(
  () => import("./components/view-field-technician-panel"),
  {
    ssr: false,
  }
);

export default function FieldTechnicianPage() {
  const { projectID } = useParams();

  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<AssignedProjectsType | null>(
    null
  );
  const [isAddMode, setIsAddMode] = useState(false);

  const handleRowSelect: (row: AssignedProjectsType) => void = (row) => {
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

  const { data, isLoading, error } = useSelectFieldTechniciansByProjectIDHook(
    projectID as string
  );

  return (
    <CustomPageLayout
      pageTitle="Assigned Field Technicians"
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(projectID as string)}
    >
      <DataTable
        columns={columns}
        data={data ?? []}
        onRowSelect={handleRowSelect}
        onAdd={handleAdd}
      />
      <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
        <SheetContent className="w-screen md:min-w-2xl overflow-y-auto">
          <SheetHeader className="border-b">
            <SheetTitle className="text-primary uppercase">
              {isAddMode
                ? "Assign New Field Technician"
                : "View Member Details"}
            </SheetTitle>
          </SheetHeader>
          {isAddMode ? (
            <SelectMembersTable
              assignedMembers={
                (data && data.map((d) => d.user_id as string)) ?? []
              }
              setPanelOpen={setPanelOpen}
            />
          ) : (
            <ViewFieldTechnicianPanel
              selectedRow={selectedRow}
              setPanelOpen={setPanelOpen}
            />
          )}
        </SheetContent>
      </Sheet>
    </CustomPageLayout>
  );
}
