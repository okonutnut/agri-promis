"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { FCAForm } from "./components/fca-form";
import { FCAType } from "@/components/types";
import { useSelectAllFCAHook } from "@/app/hooks/FCAHook";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";

function FCAContent({ values }: { values: FCAType[] | undefined }) {
  const { openSheet, closeSheet } = useSheet();

  const handleRowSelect = (row: FCAType) => {
    openSheet(
      "View FCA Details",
      <FCAForm
        isAddMode={false}
        key={`view-${row.id}`}
        data={row}
        setPanelOpen={() => closeSheet()}
      />
    );
  };

  const handleAdd = () => {
    openSheet(
      "Add New FCA Entry",
      <FCAForm
        isAddMode={true}
        key="add-mode"
        data={null}
        setPanelOpen={() => closeSheet()}
      />
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

export default function FCAPage() {
  const { data, isLoading, error } = useSelectAllFCAHook();

  return (
    <CustomPageLayout
      pageTitle="Farmers' Cooperatives and Associations"
      isLoading={isLoading}
      error={error}
      navItems={getDashboardNavItems()}
    >
      <FCAContent values={data ?? undefined} />
    </CustomPageLayout>
  );
}
