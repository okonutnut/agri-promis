"use client";

import { Button } from "@/components/ui/button";
import { Archive, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { ImageData } from "@/components/interfaces";
import { useState, useMemo } from "react";
import { useSelectCurrentUserSessionHook } from "@/app/hooks/UserProfileHook";
import { upsertDraft } from "@/hooks/use-draft";
import { useSheet } from "@/components/custom/layout/custom-page-layout";

interface SaveDraftButtonProps {
  draftKey: string;
  form: UseFormReturn<any>;
  images: ImageData[];
  isPending: boolean;
}

const createDraftData = (formData: any, images: ImageData[]) => {
  const currentDate = new Date();
  const processedImages = images.map((img) => ({
    id: img.id,
    src: img.src,
    dateTimeCaptured: img.dateTimeCaptured,
    file: img.file,
  }));

  return {
    draft_type: "post-travel" as const,
    program_id: formData.program_id || "",
    travel_order_id: formData.travel_order_id || "",
    travel_date_id: formData.travel_date_id || "",
    travel_order_no: formData.travel_order_no || "",
    project_title_activity: formData.project_title_activity || "",
    icc_fca_lgu_name: formData.icc_fca_lgu_name || "",
    projects_places_visited: formData.projects_places_visited || "",
    activities_undertaken: formData.activities_undertaken || "",
    issues_concern: formData.issues_concern || [],
    remarks: formData.remarks || "",
    images: processedImages,
    created_at: currentDate.toLocaleString("en-US", {
      timeZone: "Asia/Manila",
    }),
  };
};

export default function SaveDraftButton({
  draftKey,
  form,
  images,
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
      const draftData = createDraftData(formData, images);

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
