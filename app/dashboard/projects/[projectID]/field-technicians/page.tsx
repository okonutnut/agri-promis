"use client";

import { useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSelectFieldTechniciansByProjectIDHook } from "@/components/hooks";
import CustomPageLayout from "@/components/custom/layout/admin-page-layout";
import { useParams } from "next/navigation";
import SelectMembersTable from "./components/members-sheet/select-members-table";
import { Button } from "@/components/ui/button";
import { AssignedProjectsType } from "@/components/types";
import ViewFieldTechnicianPanel from "./components/view-field-technician-panel";

export default function FieldTechnicianPage() {
  const { projectID } = useParams();

  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<AssignedProjectsType | null>(
    null
  );
  const [isAddMode, setIsAddMode] = useState(false);

  const handleRowSelect = (row: AssignedProjectsType) => {
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
  console.log("Field Technicians Data:", data);
  console.log("Selected Row:", selectedRow);

  return (
    <CustomPageLayout
      pageTitle="Assigned Field Technicians"
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
            <SheetContent className="w-screen md:min-w-[600px] sm:min-w-[400px]">
              <SheetHeader className="border-b">
                <SheetTitle className="uppercase">
                  {isAddMode
                    ? "Assign New Field Technician"
                    : "View Member Details"}
                </SheetTitle>
              </SheetHeader>
              {isAddMode ? (
                <SelectMembersTable
                  assignedMembers={data.map((d) => d.user_id as string)}
                />
              ) : (
                <ViewFieldTechnicianPanel />
              )}
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant={"outline"}>Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </>
      )}
    </CustomPageLayout>
  );
}
