"use client";

import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import { TeamMemberForm } from "./team-members-form";
import { UserProfileType } from "@/components/types";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import { useMemo, useState } from "react";
import { useUniversalRealtime } from "@/hooks/use-universal-realtime";
import { SelectAllMembersAction } from "@/app/actions/MemberAction";
import { CustomTabList } from "@/components/custom/layout/custom-tab-list";
import TeamMemberPanel from "./team-member-panel";

type TeamMembersContentProps = {
  values: UserProfileType[] | undefined;
};

function TeamMembersContent({ values }: TeamMembersContentProps) {
  const { openSheet } = useSheet();
  const [programID, setProgramID] = useState<string>("");

  const handleRowSelect = (row: UserProfileType) => {
    openSheet(
      "View Member Details",
      <CustomTabList
        tabs={[
          {
            title: "User Information",
            content: <TeamMemberForm isAddMode={false} data={row} />,
          },
          {
            title: "Assigned Program/Projects",
            content: <TeamMemberPanel userId={row.id as string} data={row} />,
          },
        ]}
      />,
    );
  };

  const handleAdd = () => {
    openSheet(
      "Invite New Team Member",
      <TeamMemberForm isAddMode={true} data={null} />,
    );
  };

  if (!values) return null;

  const filteredValues = useMemo(() => {
    if (programID !== "all") {
      return values.filter((v) => v.program_ids?.includes(programID));
    }

    return values;
  }, [values, programID]);

  return (
    <DataTable
      columns={columns}
      data={filteredValues || []}
      onRowSelect={handleRowSelect}
      onAdd={handleAdd}
      programID={setProgramID}
    />
  );
}

export default function TeamMembersClient() {
  const { data, isLoading, error } = useUniversalRealtime({
    queryFn: SelectAllMembersAction,
    queryKey: ["team-members"],
    tables: [
      "user_profile",
      "assigned_fieldtechnicians",
      "assigned_projects",
      "programs",
    ],
  });

  return (
    <CustomPageLayout
      pageTitle="Team Members"
      pageDescription="View and manage all registered team members."
      isLoading={isLoading}
      error={error}
      navItems={getDashboardNavItems()}
    >
      <TeamMembersContent values={data ?? undefined} />
    </CustomPageLayout>
  );
}
