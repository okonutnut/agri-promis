import {
  useInsertFieldTechnicianToProjectHook,
  useSelectAllMembersByRoleHook,
} from "@/components/hooks";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { useMemo } from "react";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import { useParams } from "next/navigation";
import { toast } from "sonner";

type SelectMemberTableProps = {
  assignedMembers: string[];
};
export default function SelectMemberTable({
  assignedMembers,
}: SelectMemberTableProps) {
  const { projectID } = useParams();

  // GET
  const { data, isLoading, isError } =
    useSelectAllMembersByRoleHook("field_technician");
  const tableData = useMemo(() => {
    if (!data) return [];
    return data.filter((member) => {
      if (!assignedMembers) return true;
      return !assignedMembers.includes(member.id as string);
    });
  }, [assignedMembers, data]);
  console.log("Members Data:", tableData);

  // POST
  const {
    mutate,
    isError: addError,
    isPending,
  } = useInsertFieldTechnicianToProjectHook(projectID as string);

  return (
    <>
      {(isLoading || isError) && <SkeletonLoading />}
      {addError && toast.error("Failed to add member(s).")}
      {!isLoading && !isError && (
        <DataTable columns={columns(mutate, isPending)} data={tableData} />
      )}
    </>
  );
}
