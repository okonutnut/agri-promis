"use client";

import dynamic from "next/dynamic";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useSelectFieldTechniciansByProjectIDHook } from "@/components/hooks";
import { useParams } from "next/navigation";
import { AssignedProjectsType } from "@/components/types";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import FTTravelOrders from "./components/ft-travel-orders";
const SelectMembersTable = dynamic(
  () => import("./components/members-sheet/select-members-table"),
  {
    ssr: false,
  }
);
const ViewFieldTechnicianPanel = dynamic(
  () => import("./components/view-field-technician-panel"),
  {
    ssr: false,
  }
);

function FieldTechnicianContent({
  data,
}: {
  data: AssignedProjectsType[] | undefined;
}) {
  const { openSheet, closeSheet, openSheetWithTabs } = useSheet();

  const handleRowSelect = (row: AssignedProjectsType) => {
    openSheetWithTabs("View Member Details", [
      {
        label: "Current Info",
        value: "details",
        content: <ViewFieldTechnicianPanel selectedRow={row} />,
      },
      {
        label: "Travel Orders",
        value: "travel-orders",
        content: <FTTravelOrders user_id={row.user_id as string} />,
      },
    ]);
  };

  const handleAdd = () => {
    openSheet(
      "Assign New Field Technician",
      <SelectMembersTable
        assignedMembers={(data && data.map((d) => d.user_id as string)) ?? []}
        setPanelOpen={(open) => !open && closeSheet()}
      />
    );
  };

  if (!data) return null;

  return (
    <DataTable
      columns={columns}
      data={data ?? []}
      onRowSelect={handleRowSelect}
      onAdd={handleAdd}
    />
  );
}

export default function FieldTechnicianPage() {
  const { projectID } = useParams();
  const { data, isLoading, error } = useSelectFieldTechniciansByProjectIDHook(
    projectID as string
  );

  return (
    <CustomPageLayout
      pageTitle="Assigned Field Technicians"
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(projectID as string)}
    >
      <FieldTechnicianContent data={data ?? undefined} />
    </CustomPageLayout>
  );
}
