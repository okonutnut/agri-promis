"use client";

import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useDeleteFieldTechnicianToProjectHook } from "@/components/hooks";
import { Button } from "@/components/ui/button";
import { Loader2, TriangleAlert } from "lucide-react";
import { useParams } from "next/navigation";

type RemoveFTButtonProps = {
  userID: string;
};
export default function RemoveFTButton({ userID }: RemoveFTButtonProps) {
  const { projectID } = useParams();
  const { closeSheet } = useSheet();
  const { openModal, closeModal } = useModal();
  const { mutate, isPending } = useDeleteFieldTechnicianToProjectHook(
    projectID as string
  );

  const onSubmit = () =>
    mutate(userID, {
      onSuccess: () => {
        closeSheet();
      },
    });

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
