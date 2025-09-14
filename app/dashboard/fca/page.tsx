"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { FCAForm } from "./components/fca-form";
import { FCAType } from "@/components/types";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import FCAPanel from "./components/fca-projects";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllFCAAction } from "@/app/actions/FCAAction";
import { CustomTabList } from "@/components/custom/layout/custom-tab-list";

function FCAContent({ values }: { values: FCAType[] | undefined }) {
  const { openSheet } = useSheet();

  const handleRowSelect = (row: FCAType) => {
    openSheet(
      "View FCA Details",
      <CustomTabList
        tabs={[
          {
            title: "FCA Details",
            content: <FCAForm isAddMode={false} key={row.id} data={row} />,
          },
          {
            title: "Projects",
            content: <FCAPanel fcaID={row.id as string} />,
          },
        ]}
      />
    );
  };

  const handleAdd = () => {
    openSheet(
      "Add New FCA Entry",
      <FCAForm isAddMode={true} key="add-mode" data={null} />
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
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["farmers"],
    table: "farmers",
    queryFn: SelectAllFCAAction,
  });

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
