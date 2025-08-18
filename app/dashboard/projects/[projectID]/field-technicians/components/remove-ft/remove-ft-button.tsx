"use client";

import ConfirmAlertDialog from "@/components/custom/alert/confirm-alert";
import { useDeleteFieldTechnicianToProjectHook } from "@/components/hooks";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

type RemoveFTButtonProps = {
  userID: string;
  setIsLoading: (isLoading: boolean) => void;
  setPanelOpen: (isOpen: boolean) => void; // Add setPanelOpen prop
};
export default function RemoveFTButton({
  userID,
  setIsLoading,
  setPanelOpen, // Destructure setPanelOpen
}: RemoveFTButtonProps) {
  const { projectID } = useParams();
  const { mutate, isPending } = useDeleteFieldTechnicianToProjectHook(
    projectID as string
  );

  const onSubmit = () =>
    mutate(userID, {
      onSuccess: () => {
        // Close the sheet after successful mutation
        setPanelOpen(false);
      },
    });

  useEffect(() => {
    if (isPending) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isPending, setIsLoading]);

  return (
    <ConfirmAlertDialog
      title="Remove Field Technician"
      description="Are you sure you want to remove this field technician from the project?"
      onSubmit={onSubmit}
      confirmText="CONFIRM"
      trigger={
        <Button variant={"outline"} size={"sm"} className="text-red-500">
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
