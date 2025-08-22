"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import IssueTravelOrderForm from "./components/travel-order-form";
import { TravelOrderType } from "@/components/types";
import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import { useSelectAllTravelOrdersByUserIDHook } from "@/components/hooks";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { dataTagErrorSymbol } from "@tanstack/react-query";

function TravelOrderContent({ data }: { data: TravelOrderType[] | undefined }) {
  const { openSheet } = useSheet();

  const handleRowSelect = (row: TravelOrderType) => {
    openSheet(
      "View Travel Order Details",
      <IssueTravelOrderForm values={row} />
    );
  };

  if (!dataTagErrorSymbol) return null;

  return (
    <DataTable
      columns={columns}
      data={data || []}
      onRowSelect={handleRowSelect}
    />
  );
}

export default function FieldTechnicianPage() {
  const { data, isLoading, error } = useSelectAllTravelOrdersByUserIDHook();
  return (
    <CustomPageLayout
      pageTitle="Travel Orders"
      isLoading={isLoading}
      error={error}
      navItems={getUserDashboardNavItems()}
      role="user"
    >
      <TravelOrderContent data={data ?? undefined} />
    </CustomPageLayout>
  );
}
