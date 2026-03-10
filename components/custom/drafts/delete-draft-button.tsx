"use client";

import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { Button } from "@/components/ui/button";
import { deleteDraft } from "@/hooks/use-draft";
import { Trash } from "lucide-react";
import { useState } from "react";

type DeleteDraftButtonProps = {
  draftKey: string;
};

export default function DeleteDraftButton({
  draftKey,
}: DeleteDraftButtonProps) {
  const [state, setState] = useState<"idle" | "pending">("idle");
  const { closeSheet } = useSheet();
  const { openModal, closeModal } = useModal();

  const handleDelete = async () => {
    setState("pending");
    await deleteDraft(draftKey);
    setState("idle");
    closeModal();
    closeSheet();
  };

  const confirmDiscard = () => {
    openModal(
      "Discard Draft",
      "Are you sure you want to discard this draft? This action cannot be undone.",
      <Button
        className="w-full"
        variant="destructive"
        onClick={handleDelete}
      >
        Discard
      </Button>,
    );
  };

  return (
    <Button
      variant="outline"
      size={"sm"}
      disabled={state === "pending"}
      onClick={confirmDiscard}
    >
      <Trash className="h-4 w-4" color="red" />
      Discard
    </Button>
  );
}
