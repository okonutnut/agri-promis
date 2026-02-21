"use client";

import { DeleteFieldTechnicianFromProjectAction } from "@/app/actions/AssignedProjectAction";
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
  const { projectID } = useParams();

  const { closeSheet } = useSheet();
  const { openModal, closeModal } = useModal();
  const { setLoading } = useLoading();

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (userID: string) =>
      await DeleteFieldTechnicianFromProjectAction(userID, projectID as string),
  });

  const onSubmit = () => {
    setLoading(true);
    mutate(userID, {
      onSuccess: () => {
        toast.success("Field technician removed from project");
      },
      onError: () => {
        toast.error("Failed to remove field technician from project");
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
          "Are you sure you want to remove this field technician from the project? This action cannot be undone.",
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
          Remove from project
        </>
      )}
    </Button>
  );
}
