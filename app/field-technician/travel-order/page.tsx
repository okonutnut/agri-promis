"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { TravelOrderType } from "@/components/types";
import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllTravelOrdersByUserIDAction } from "@/app/actions/TravelOrderAction";
import IssueTravelOrderForm from "./components/travel-order-form";

function TravelOrderContent({ data }: { data: TravelOrderType[] | undefined }) {
  const { openSheet } = useSheet();

  const handleRowSelect = (row: TravelOrderType) => {
    openSheet(
      "View Travel Order Details",
      <IssueTravelOrderForm isAddMode={false} values={row} key={row.id} />,
    );
  };

  const handleAdd = () => {
    openSheet(
      "Create Travel Order",
      <IssueTravelOrderForm isAddMode={true} values={null} key="add-mode" />,
    );
  };

  return (
    <DataTable
      columns={columns}
      data={data || []}
      onRowSelect={handleRowSelect}
      onAdd={handleAdd}
      addButtonLabel="New Travel Order"
    />
  );
}

export default function FieldTechnicianPage() {
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["travel_order", "current_user"],
    queryFn: async () => await SelectAllTravelOrdersByUserIDAction(),
    table: "travel_order",
  });

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
