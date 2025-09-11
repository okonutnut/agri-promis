"use client";

import { useInsertFieldTechniciansToProjectHook } from "@/components/hooks";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import { useParams } from "next/navigation";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllMembersByRoleAction } from "@/app/actions/MemberAction";

type SelectMemberTableProps = {
  assignedMembers: string[];
  setPanelOpen: Dispatch<SetStateAction<boolean>>;
};
export default function SelectMemberTable({
  assignedMembers,
  setPanelOpen,
}: SelectMemberTableProps) {
  const { projectID } = useParams();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // GET
  const { data, isLoading, isError } = useRealtimeQuery({
    queryKey: ["field-project-field-technicians"],
    queryFn: () => SelectAllMembersByRoleAction(2),
    table: "user_profile",
  });

  const tableData = useMemo(() => {
    if (!data) return [];
    return data.filter((member) => {
      if (!assignedMembers) return true;
      return !assignedMembers.includes(member.id as string);
    });
  }, [assignedMembers, data]);

  // POST
  const { mutate, isPending } = useInsertFieldTechniciansToProjectHook(
    projectID as string
  );
  const onSubmit = () => {
    mutate(selectedRows, {
      onSuccess: () => {
        setPanelOpen(false);
      },
    });
  };
  const handleRowSelectionChange = useCallback(
    (selectedRows: typeof tableData) => {
      setSelectedRows(selectedRows.map((row) => row.id as string));
    },
    [setSelectedRows]
  );

  return (
    <>
      {isLoading || isError ? (
        <SkeletonLoading />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={tableData}
            isPending={isPending}
            onAdd={onSubmit}
            onRowSelectionChange={handleRowSelectionChange}
          />
        </>
      )}
    </>
  );
}
