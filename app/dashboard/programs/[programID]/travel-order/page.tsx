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
import CustomPageLayout from "@/components/custom/layout/admin-page-layout";
import { useParams } from "next/navigation";
import SelectMembersTable from "./components/travel-order-form/travel-order-form";
import { Button } from "@/components/ui/button";
import { AssignedProjectsType } from "@/components/types";
import { getProgramNavItems } from "@/components/sidebar/navitems";

export default function FieldTechnicianPage() {
  const { programID } = useParams();

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

  return (
    <CustomPageLayout
      pageTitle="Issued Travel Orders"
      navItems={getProgramNavItems(programID as string)}
    >
      <DataTable
        columns={columns}
        data={[]}
        onRowSelect={handleRowSelect}
        onAdd={handleAdd}
      />
      <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
        <SheetContent className="w-screen md:min-w-[600px] sm:min-w-[400px]">
          <SheetHeader className="border-b">
            <SheetTitle className="uppercase">
              {isAddMode ? "Issue Travel Order" : "View Travel Order Details"}
            </SheetTitle>
          </SheetHeader>
          <SelectMembersTable assignedMembers={[]} />
        </SheetContent>
      </Sheet>
    </CustomPageLayout>
  );
}
