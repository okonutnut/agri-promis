"use client";

import React, { useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
const CustomPageLayout = React.lazy(
  () => import("@/components/custom/layout/custom-page-layout")
);
const IssueTravelOrderForm = React.lazy(
  () => import("./components/travel-order-form")
);
import { useParams } from "next/navigation";
import { TravelOrderType } from "@/components/types";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { useSelectAllTravelOrdersByProgramIDHook } from "@/components/hooks";

export default function FieldTechnicianPage() {
  const { programID } = useParams();

  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TravelOrderType | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const handleRowSelect = (row: TravelOrderType) => {
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

  const { data, isLoading, error } = useSelectAllTravelOrdersByProgramIDHook(
    programID as string
  );

  return (
    <CustomPageLayout
      pageTitle="Issued Travel Orders"
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <DataTable
        columns={columns}
        data={data || []}
        onRowSelect={handleRowSelect}
        onAdd={handleAdd}
      />
      <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
        <SheetContent className="w-screen md:min-w-[600px]">
          <SheetHeader className="border-b">
            <SheetTitle className="uppercase">
              {isAddMode ? "Issue Travel Order" : "View Travel Order Details"}
            </SheetTitle>
          </SheetHeader>
          <IssueTravelOrderForm isAddMode={isAddMode} values={selectedRow} />
        </SheetContent>
      </Sheet>
    </CustomPageLayout>
  );
}
