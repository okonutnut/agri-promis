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
import { InsertFieldTechniciansToProgramAction } from "@/app/actions/AssignedProgramAction";
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
  const { programID } = useParams();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // GET
  const { data, isLoading, isError } = useRealtimeQuery({
    queryKey: ["field-technicians", programID as string],
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
      InsertFieldTechniciansToProgramAction(memberIDs, programID as string),
    invalidateKeys: ["program-field-technicians", programID as string],
  });

  const onSubmit = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one field technician");
      return;
    }

    mutate(selectedRows, {
      onSuccess: () => {
        toast.success("Field technicians added successfully");
        setPanelOpen(false);
        setSelectedRows([]);
      },
      onError: (error: any) => {
        const errorMessage = error?.message || error?.toString() || "Failed to add field technicians";
        toast.error(errorMessage);
        console.error("Error adding field technicians:", error);
      },
      onSettled: () => {
        // Only close if not already closed in onSuccess
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
        />
      )}
      <CustomSheetFooter isPending={loadingState} />
    </>
  );
}

