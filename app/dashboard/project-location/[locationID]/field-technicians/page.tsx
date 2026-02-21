"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { AssignedProjectsType } from "@/components/types";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllFieldTechniciansByProjectIDAction } from "@/app/actions/AssignedProjectAction";
import SelectMembersTable from "./components/members-sheet/select-members-table";
import ViewFieldTechnicianPanel from "./components/view-field-technician-panel";

type FieldTechnicianPageProps = {
  data: AssignedProjectsType[] | undefined;
};
function FieldTechnicianContent({ data }: FieldTechnicianPageProps) {
  const { openSheet, closeSheet } = useSheet();

  const handleRowSelect = (row: AssignedProjectsType) => {
    openSheet(
      "View Member Details",
      <ViewFieldTechnicianPanel selectedRow={row} />
    );
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
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["project-field-technicians", projectID as string],
    queryFn: () =>
      SelectAllFieldTechniciansByProjectIDAction(projectID as string),
    table: "assigned_projects",
  });

  return (
    <CustomPageLayout
      pageTitle="Assigned Field Technicians"
      pageDescription="View and manage assigned field technicians for the project."
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(projectID as string)}
    >
      <FieldTechnicianContent data={data ?? undefined} />
    </CustomPageLayout>
  );
}
