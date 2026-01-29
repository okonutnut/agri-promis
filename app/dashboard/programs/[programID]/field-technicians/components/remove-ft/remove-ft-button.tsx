"use client";

import { DeleteFieldTechnicianFromProgramAction } from "@/app/actions/AssignedProgramAction";
import {
  useLoading,
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { Button } from "@/components/ui/button";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { Loader2, TriangleAlert } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

type RemoveFTButtonProps = {
  userID: string;
};
export default function RemoveFTButton({ userID }: RemoveFTButtonProps) {
  const { programID } = useParams();

  const { closeSheet } = useSheet();
  const { openModal, closeModal } = useModal();
  const { setLoading } = useLoading();

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (userID: string) =>
      await DeleteFieldTechnicianFromProgramAction(userID, programID as string),
    invalidateKeys: ["program-field-technicians", programID as string],
  });

  const onSubmit = () => {
    setLoading(true);
    mutate(userID, {
      onSuccess: () => {
        toast.success("Field technician removed from program");
      },
      onError: () => {
        toast.error("Failed to remove field technician from program");
      },
      onSettled: () => {
        setLoading(false);
        closeSheet();
      },
    });
  };

  return (
    <Button
      size={"sm"}
      variant={isPending ? "ghost" : "outline"}
      disabled={isPending}
      onClick={() =>
        openModal(
          "Remove Field Technician",
          "Are you sure you want to remove this field technician from the program? This action cannot be undone.",
          <Button
            className="w-full"
            onClick={() => {
              onSubmit();
              closeModal();
            }}
          >
            Confirm
          </Button>
        )
      }
    >
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <TriangleAlert className="text-red-500" />
          Remove from program
        </>
      )}
    </Button>
  );
}

