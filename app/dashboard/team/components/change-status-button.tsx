"use client";

import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useUpdateActiveStatusMemberHook } from "@/components/hooks";
import { UserProfileType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Loader2, TriangleAlert } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

type ChangeStatusButtonProps = {
  data?: UserProfileType | null;
  form: UseFormReturn<any>;
};
export default function ChangeStatusButton({
  data,
  form,
}: ChangeStatusButtonProps) {
  const { openModal, closeModal } = useModal();
  const { closeSheet } = useSheet();

  // ACTIVE STATUS HOOK
  const { mutate, isPending } = useUpdateActiveStatusMemberHook();

  const statusSubmit = (userID: string, status: number) => {
    mutate(
      {
        userID: userID,
        status: status,
      },
      {
        onSuccess: () => {
          form.reset();
          closeSheet();
        },
      }
    );
  };

  return (
    <Button
      size={"sm"}
      onClick={() => {
        openModal(
          "Change Active Status",
          "Are you sure you want to change the active status of this member?",
          <Button
            size={"sm"}
            className="w-full"
            onClick={() => {
              statusSubmit(
                data?.id as string,
                data?.active_status == 1 ? 0 : 1
              );
              closeModal();
            }}
          >
            Confirm
          </Button>
        );
      }}
      variant={isPending ? "ghost" : "outline"}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <TriangleAlert className="text-red-500" />
          Set as {data?.active_status == 1 ? "Inactive" : "Active"}
        </>
      )}
    </Button>
  );
}
