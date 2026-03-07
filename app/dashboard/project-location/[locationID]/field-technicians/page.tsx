"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { AssignedProjectsType } from "@/components/types";
import { getProjectLocationNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllFieldTechniciansByProjectIDAction } from "@/app/actions/AssignedProjectAction";
import SelectProjectLocationDetailsByIDAction from "@/app/actions/ProjectLocationAction";
import SelectMembersTable from "./components/members-sheet/select-members-table";
import ViewFieldTechnicianPanel from "./components/view-field-technician-panel";

type FieldTechnicianPageProps = {
  data: AssignedProjectsType[] | undefined;
};
function FieldTechnicianContent({ data }: FieldTechnicianPageProps) {
  const { openSheet, closeSheet } = useSheet();
  const { projectID } = useParams();

  const { data: projectStatus } = useRealtimeQuery({
    queryKey: ["project-status-check"],
    queryFn: () =>
      SelectProjectLocationDetailsByIDAction(projectID as string),
    table: "project_location",
  });

  const handleRowSelect = (row: AssignedProjectsType) => {
    openSheet(
      "View Member Details",
      <ViewFieldTechnicianPanel selectedRow={row} />,
    );
  };

  const handleAdd = () => {
    openSheet(
      "Assign New Field Technician",
      <SelectMembersTable
        assignedMembers={(data && data.map((d) => d.user_id as string)) ?? []}
        setPanelOpen={(open) => !open && closeSheet()}
      />,
    );
  };

  if (!data) return null;

  return (
    <DataTable
      columns={columns}
      data={data ?? []}
      onRowSelect={handleRowSelect}
      onAdd={projectStatus?.status != 0 ? handleAdd : undefined}
      addButtonLabel="Assign New"
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
      navItems={getProjectLocationNavItems(projectID as string)}
    >
      <FieldTechnicianContent data={data ?? undefined} />
    </CustomPageLayout>
  );
}
