"use client";

import { useSheet } from "@/components/custom/layout/custom-page-layout";
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

  const handleDelete = async () => {
    setState("pending");
    await deleteDraft(draftKey);
    setState("idle");
    closeSheet();
  };

  return (
    <Button
      variant="outline"
      size={"sm"}
      disabled={state === "pending"}
      onClick={() => handleDelete()}
    >
      <Trash className="h-4 w-4" color="red" />
      Discard
    </Button>
  );
}
