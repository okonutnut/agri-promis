"use client";

import { useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { FCAForm } from "./components/fca-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FCAType } from "@/components/types";
import { useSelectAllFCAHook } from "@/components/hooks";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";

export default function FCAPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FCAType | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const handleRowSelect = (row: FCAType) => {
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

  const { data, isLoading, error } = useSelectAllFCAHook();

  return (
    <CustomPageLayout
      pageTitle="Farmers' Cooperatives and Associations"
      isLoading={isLoading}
      error={error}
      navItems={getDashboardNavItems()}
    >
      {data && (
        <>
          <DataTable
            columns={columns}
            data={data || []}
            onRowSelect={handleRowSelect}
            onAdd={handleAdd}
          />
          <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
            <SheetContent className="md:min-w-[600px] w-screen">
              <SheetHeader className="border-b">
                <SheetTitle className="uppercase text-primary">
                  {isAddMode ? "Add New FCA Entry" : "View FCA Details"}
                </SheetTitle>
              </SheetHeader>
              <FCAForm
                isAddMode={isAddMode}
                key={isAddMode ? "add-mode" : selectedRow?.id || "view-mode"}
                data={isAddMode ? null : selectedRow}
                setPanelOpen={setPanelOpen}
              />
            </SheetContent>
          </Sheet>
        </>
      )}
    </CustomPageLayout>
  );
}
