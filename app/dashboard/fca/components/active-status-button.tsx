import { SoftDeleteAction } from "@/app/actions/DeleteAction";
import { EditFCAActiveStatusAction } from "@/app/actions/FCAAction";
import { useEditFCAActiveStatusHook } from "@/app/hooks/FCAHook";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { Button } from "@/components/ui/button";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { AlertTriangle, Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

type FCAActiveStatusButtonProps = {
  pageState: "idle" | "loading";
  setPageState: (state: "idle" | "loading") => void;
  fcaID: string;
  status: number;
};
export default function FCAActiveStatusButton({
  pageState,
  setPageState,
  fcaID,
  status,
}: FCAActiveStatusButtonProps) {
  const { closeSheet } = useSheet();
  const { openModal, closeModal } = useModal();

  // ACTIVE STATUS MUTATION
  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async ({ fcaID, status }: { fcaID: string; status: number }) =>
      await EditFCAActiveStatusAction(fcaID, status),
    onSuccess: () => {
      toast.success("FCA status updated successfully!");
      setPageState("idle");
      closeSheet();
    },
    onError: () => {
      toast.error(`Something went wrong. Please try again.`);
    },
  });

  // DELETE MUTATION
  const { mutate: deleteMutate, isPending: isDeletePending } =
    useUniversalMutation({
      mutationFn: async (data: { tableName: string; recordId: string }) =>
        await SoftDeleteAction({
          tableName: data.tableName,
          recordId: data.recordId,
        }),
      onSuccess: () => {
        toast.success("FCA deleted successfully!");
        setPageState("idle");
        closeSheet();
      },
      onError: () => {
        toast.error(`Failed to delete FCA. Please try again.`);
      },
    });

  const onStatusChange = () => {
    mutate({ fcaID, status: status === 1 ? 0 : 1 });
    closeModal();
  };

  const onDelete = () => {
    deleteMutate({ tableName: "farmers", recordId: fcaID });
    closeModal();
  };

  return (
    <>
      <Button
        variant={isDeletePending ? "ghost" : "outline"}
        size={"sm"}
        onClick={() => {
          openModal(
            "Attention",
            "Are you sure you want to delete this FCA? This action cannot be undone.",
            <Button
              className="w-full"
              variant={"destructive"}
              onClick={onDelete}
            >
              Confirm
            </Button>,
          );
        }}
        disabled={isDeletePending || pageState === "loading"}
      >
        {isDeletePending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Trash className="text-red-500 mr-2" />
            Delete
          </>
        )}
      </Button>

      <Button
        variant={isPending ? "ghost" : "outline"}
        size={"sm"}
        onClick={() => {
          openModal(
            "Attention",
            "Are you sure you want to change the active status of this FCA? This action cannot be undone.",
            <Button
              className="w-full"
              variant={"destructive"}
              onClick={onStatusChange}
            >
              Confirm
            </Button>,
          );
        }}
        disabled={isPending || pageState === "loading"}
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <AlertTriangle className="text-red-500" />
            Set {status === 1 ? "Inactive" : "Active"}
          </>
        )}
      </Button>
    </>
  );
}
