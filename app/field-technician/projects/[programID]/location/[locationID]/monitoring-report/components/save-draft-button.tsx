"use client";

import { Button } from "@/components/ui/button";
import { Archive, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { ImageData } from "@/components/interfaces";
import { useState, useMemo } from "react";
import { useSelectCurrentUserSessionHook } from "@/app/hooks/UserProfileHook";
import { MonitoringReportType } from "@/components/types";
import { upsertDraft } from "@/hooks/use-draft";
import { useParams } from "next/navigation";
import { useSheet } from "@/components/custom/layout/custom-page-layout";

interface SaveDraftButtonProps {
  draftKey: string;
  form: UseFormReturn<any>;
  images: ImageData[];
  isPending: boolean;
}

// Helper function to create draft data
const createDraftData = (
  projectID: string,
  formData: any,
  images: ImageData[]
): MonitoringReportType => {
  const currentDate = new Date();
  const processedImages = images.map((img) => ({
    id: img.id,
    src: img.src,
    dateTimeCaptured: img.dateTimeCaptured,
    file: img.file,
  }));

  return {
    project_location_id: projectID,
    images: processedImages,
    purpose: formData.purpose || "",
    findings: formData.findings || [],
    observation: formData.observation || "",
    issues_concern: formData.issues_concern || [],
    remarks: formData.remarks || "",
    travel_order_id: formData.travel_order_id || "",
    travel_date_id: formData.travel_date_id || "",
    travel_order_no: formData.travel_order_no || "",
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
  const { locationID } = useParams();
  const { closeSheet } = useSheet();

  const { data, isFetched } = useSelectCurrentUserSessionHook();
  const [isSaving, setIsSaving] = useState(false);

  const isDisabled = useMemo(
    () => isPending || isSaving || !isFetched,
    [isPending, isSaving, isFetched]
  );

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);

      const formData = form.getValues();
      const draftData = createDraftData(locationID as string, formData, images);

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
