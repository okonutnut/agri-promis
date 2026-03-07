"use client";

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
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { InsertFieldTechniciansToProjectAction } from "@/app/actions/AssignedProjectAction";
import { toast } from "sonner";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";

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
    queryKey: ["field-technicians", projectID as string],
    queryFn: () => SelectAllMembersByRoleAction(2),
    table: "user_profile",
  });

  const tableData = useMemo(() => {
    return data?.filter((member) => {
      if (!assignedMembers) return true;
      return !assignedMembers.includes(member.id as string);
    });
  }, [assignedMembers, data]);

  // POST
  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (memberIDs: string[]) =>
      InsertFieldTechniciansToProjectAction(memberIDs, projectID as string),
    invalidateKeys: ["project-field-technicians", projectID as string],
  });

  const onSubmit = () => {
    mutate(selectedRows, {
      onSuccess: () => {
        toast.success("Field technicians added successfully");
      },
      onError: () => {
        toast.error("Failed to add field technicians");
      },
      onSettled: () => {
        setPanelOpen(false);
        setSelectedRows([]);
      },
    });
  };

  const loadingState = isLoading || isPending;

  const handleRowSelectionChange = useCallback(
    (selectedRows: typeof tableData) => {
      setSelectedRows(selectedRows!.map((row) => row.id as string));
    },
    [setSelectedRows]
  );

  return (
    <>
      {isLoading || isError ? (
        <SkeletonLoading className="m-2" />
      ) : (
        <DataTable
          columns={columns}
          data={tableData ?? []}
          isPending={isPending}
          onAdd={onSubmit}
          onRowSelectionChange={handleRowSelectionChange}
          addButtonLabel="Assign"
          confirmOnAdd
          confirmTitle="Attention!!!"
          confirmMessage="Are you sure you want to add this user?"
          confirmButtonLabel="Proceed"
          className="m-2"
        />
      )}
      <CustomSheetFooter isPending={loadingState} />
    </>
  );
}
