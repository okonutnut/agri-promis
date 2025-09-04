"use client";

import ConfirmAlertDialog from "@/components/custom/alert/confirm-alert";
import { useSheet } from "@/components/custom/layout/custom-page-layout";
import { useDeleteFieldTechnicianToProjectHook } from "@/components/hooks";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

type RemoveFTButtonProps = {
  userID: string;
};
export default function RemoveFTButton({ userID }: RemoveFTButtonProps) {
  const { projectID } = useParams();
  const { closeSheet } = useSheet();
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
    <ConfirmAlertDialog
      title="Remove Field Technician"
      description="Are you sure you want to remove this field technician from the project?"
      onSubmit={onSubmit}
      confirmText="CONFIRM"
      trigger={
        <Button
          variant={"outline"}
          size={"sm"}
          className="w-full px-3text-red-500"
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <AlertTriangle color="red" />
              Remove From Project
            </>
          )}
        </Button>
      }
    />
  );
}
