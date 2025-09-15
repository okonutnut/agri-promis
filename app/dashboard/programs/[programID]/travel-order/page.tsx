"use client";

import dynamic from "next/dynamic";
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
const IssueTravelOrderForm = dynamic(
  () => import("./components/travel-order-form"),
  {
    ssr: false,
  }
);

function TravelOrderContent({
  values,
}: {
  values: TravelOrderType[] | undefined;
}) {
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
    />
  );
}

export default function TravelOrderPage() {
  const { programID } = useParams();
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["travel_order"],
    queryFn: () => SelectAllTravelOrdersByProgramIDAction(programID as string),
    table: "travel_order",
  });
  console.log({ data });

  return (
    <CustomPageLayout
      pageTitle="Travel Orders"
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <TravelOrderContent values={data ?? undefined} />
    </CustomPageLayout>
  );
}
