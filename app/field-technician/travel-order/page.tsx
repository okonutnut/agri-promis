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
import IssueTravelOrderForm from "./components/travel-order-form";
import { TravelOrderType } from "@/components/types";
import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import { useSelectAllTravelOrdersByUserIDHook } from "@/components/hooks";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";

export default function FieldTechnicianPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TravelOrderType | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const handleRowSelect = (row: TravelOrderType) => {
    setSelectedRow(row);
    setIsAddMode(false);
    setPanelOpen(true);
  };

  const handlePanelClose = () => {
    setPanelOpen(false);
    setIsAddMode(false);
    setSelectedRow(null);
  };

  const { data, isLoading, error } = useSelectAllTravelOrdersByUserIDHook();

  return (
    <CustomPageLayout
      pageTitle="Issued Travel Orders"
      navItems={getUserDashboardNavItems()}
      isLoading={isLoading}
      error={error}
      role="user"
    >
      <DataTable
        columns={columns}
        data={data || []}
        onRowSelect={handleRowSelect}
      />
      <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
        <SheetContent className="w-screen md:min-w-[600px]">
          <SheetHeader className="border-b">
            <SheetTitle className="uppercase">
              {isAddMode ? "Issue Travel Order" : "View Travel Order Details"}
            </SheetTitle>
          </SheetHeader>
          <IssueTravelOrderForm values={selectedRow} />
        </SheetContent>
      </Sheet>
    </CustomPageLayout>
  );
}
