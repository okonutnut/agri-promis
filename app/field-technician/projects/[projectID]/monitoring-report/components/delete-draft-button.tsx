"use client";

import { Button } from "@/components/ui/button";
import { deleteDraft } from "@/hooks/use-draft";
import { Trash } from "lucide-react";
import { useState } from "react";

type DeleteDraftButtonProps = {
  draftKey: string;
  onOpenChange: () => void;
};
export default function DeleteDraftButton({
  draftKey,
  onOpenChange,
}: DeleteDraftButtonProps) {
  const [state, setState] = useState<"idle" | "pending">("idle");
  const handleDelete = async () => {
    setState("pending");
    await deleteDraft(draftKey);
    setState("idle");
    onOpenChange();
  };

  return (
    <Button
      variant="outline"
      size={"sm"}
      disabled={state === "pending"}
      onClick={() => handleDelete()}
    >
      <Trash className="mr-2 h-4 w-4" color="red" />
      Delete Draft
    </Button>
  );
}
