"use client";

import { Button } from "@/components/ui/button";
import { Archive, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { useState, useMemo } from "react";
import { useSelectCurrentUserSessionHook } from "@/app/hooks/UserProfileHook";
import { TravelOrderProjectsType } from "@/components/types";
import { upsertDraft } from "@/hooks/use-draft";
import { useSheet } from "@/components/custom/layout/custom-page-layout";

interface SaveDraftButtonProps {
  draftKey?: string;
  form: UseFormReturn<any>;
  itinerary: TravelOrderProjectsType[];
  isPending: boolean;
}

const createDraftData = (
  formData: any,
  itinerary: TravelOrderProjectsType[],
) => {
  const currentDate = new Date();

  return {
    draft_type: "travel-order" as const,
    travel_order_no: formData.travel_order_no || "",
    program_id: formData.program_id || "",
    user_id: formData.user_id || "",
    departure_date: formData.departure_date || "",
    return_date: formData.return_date || "",
    mode_of_transport: formData.mode_of_transport || "da_rfo_02_mv",
    travel_itinerary: itinerary,
    created_at: currentDate.toLocaleString("en-US", {
      timeZone: "Asia/Manila",
    }),
  };
};

export default function SaveDraftButton({
  draftKey,
  form,
  itinerary,
  isPending,
}: SaveDraftButtonProps) {
  const { closeSheet } = useSheet();
  const { data, isFetched } = useSelectCurrentUserSessionHook();
  const [isSaving, setIsSaving] = useState(false);

  const isDisabled = useMemo(
    () => isPending || isSaving || !isFetched,
    [isPending, isSaving, isFetched],
  );

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);

      const formData = form.getValues();
      const draftData = createDraftData(formData, itinerary);

      const key =
        draftKey || `draft_${data?.user.id}_${new Date().toISOString()}`;

      await upsertDraft(key, draftData);

      toast.success("Draft saved successfully");
      closeSheet();
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      variant={isDisabled ? "ghost" : "outline"}
      disabled={isDisabled}
      onClick={handleSaveDraft}
      type="button"
      size={"sm"}
    >
      {isSaving ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Archive /> Draft
        </>
      )}
    </Button>
  );
}
