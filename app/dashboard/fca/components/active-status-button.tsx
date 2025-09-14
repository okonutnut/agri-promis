import { useEditFCAActiveStatusHook } from "@/app/hooks/FCAHook";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

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
  const { mutate, isPending } = useEditFCAActiveStatusHook();

  return (
    <Button
      variant={isPending ? "ghost" : "outline"}
      size={"sm"}
      onClick={() => {
        openModal(
          "Attention!!!",
          "Are you sure you want to proceed?",
          <Button
            className="w-full"
            onClick={() => {
              setPageState("loading");
              mutate(
                { fcaID, status: status === 1 ? 0 : 1 },
                {
                  onSuccess: () => {
                    setPageState("idle");
                    closeSheet();
                  },
                }
              );
              closeModal();
            }}
          >
            Confirm
          </Button>
        );
      }}
      disabled={isPending || pageState === "loading"}
    >
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <AlertTriangle className="text-red-500" />
          Set as {status === 1 ? "Inactive" : "Active"}
        </>
      )}
    </Button>
  );
}
