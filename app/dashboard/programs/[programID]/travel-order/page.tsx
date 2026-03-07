"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { TravelOrderType } from "@/components/types";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllTravelOrdersByProgramIDAction } from "@/app/actions/TravelOrderAction";
import IssueTravelOrderForm from "./components/travel-order-form";

type TravelOrderContentProps = {
  values: TravelOrderType[] | undefined;
};
function TravelOrderContent({ values }: TravelOrderContentProps) {
  const { openSheet } = useSheet();

  const handleRowSelect = (row: TravelOrderType) => {
    openSheet(
      "View Travel Order Details",
      <IssueTravelOrderForm
        isAddMode={false}
        values={row}
        key={`view-${row.id}`}
      />
    );
  };

  const handleAdd = () => {
    openSheet(
      "Issue Travel Order",
      <IssueTravelOrderForm isAddMode={true} values={null} key="add-mode" />
    );
  };

  if (!values) return null;

  return (
    <DataTable
      columns={columns}
      data={values || []}
      onRowSelect={handleRowSelect}
      onAdd={handleAdd}
      addButtonLabel="New Travel Order"
    />
  );
}

export default function TravelOrderPage() {
  const { programID } = useParams();

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["travel_order", programID as string],
    queryFn: () => SelectAllTravelOrdersByProgramIDAction(programID as string),
    table: "travel_order",
  });

  return (
    <CustomPageLayout
      pageTitle="Travel Orders"
      pageDescription="View & Manage Travel Orders for Field Operators."
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <TravelOrderContent values={data ?? undefined} />
    </CustomPageLayout>
  );
}
