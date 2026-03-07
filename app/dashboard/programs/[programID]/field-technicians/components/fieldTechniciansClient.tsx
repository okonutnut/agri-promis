"use client";

import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { AssignedProjectsType } from "@/components/types";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllFieldTechniciansByProgramIDAction } from "@/app/actions/AssignedProgramAction";
import SelectMembersTable from "./members-sheet/select-members-table";
import ViewFieldTechnicianPanel from "./view-field-technician-panel";

type FieldTechnicianPageProps = {
  data: AssignedProjectsType[] | undefined;
};

function FieldTechnicianContent({ data }: FieldTechnicianPageProps) {
  const { openSheet, closeSheet } = useSheet();

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
      onAdd={handleAdd}
      addButtonLabel="Assign New"
    />
  );
}

export default function FieldTechniciansClient() {
  const { programID } = useParams();
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["program-field-technicians", programID as string],
    queryFn: () =>
      SelectAllFieldTechniciansByProgramIDAction(programID as string),
    table: "assigned_fieldtechnicians",
  });

  return (
    <CustomPageLayout
      pageTitle="Assigned Field Technicians"
      pageDescription="View and manage assigned field technicians for the program."
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <FieldTechnicianContent data={data ?? undefined} />
    </CustomPageLayout>
  );
}
