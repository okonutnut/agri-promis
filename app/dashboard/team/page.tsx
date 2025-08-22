"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { TeamMemberForm } from "./components/team-members-form";
import { UserProfileType } from "@/components/types";
import { useSelectAllMembersHook } from "@/components/hooks";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";

function TeamMembersContent({
  values,
}: {
  values: UserProfileType[] | undefined;
}) {
  const { openSheet, closeSheet } = useSheet();

  const handleRowSelect = (row: UserProfileType) => {
    openSheet(
      "View Member Details",
      <TeamMemberForm
        isAddMode={false}
        data={row}
        setPanelOpen={(open) => !open && closeSheet()}
      />
    );
  };

  const handleAdd = () => {
    openSheet(
      "Invite New Team Member",
      <TeamMemberForm
        isAddMode={true}
        data={null}
        setPanelOpen={(open) => !open && closeSheet()}
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

export default function TeamMemberPage() {
  const { data, isLoading, error } = useSelectAllMembersHook();
  return (
    <CustomPageLayout
      pageTitle="Team Members"
      isLoading={isLoading}
      error={error}
      navItems={getDashboardNavItems()}
    >
      <TeamMembersContent values={data} />
    </CustomPageLayout>
  );
}
