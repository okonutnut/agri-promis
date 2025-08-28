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

interface SaveDraftButtonProps {
  draftKey: string;
  form: UseFormReturn<any>;
  images: ImageData[];
  isPending: boolean;
  onOpenChange: () => void;
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
    project_id: projectID,
    images: processedImages,
    purpose: formData.purpose || "",
    findings: formData.findings || [],
    observation: formData.observation,
    issues_concern: formData.issues_concern || [],
    remarks: formData.remarks || "",
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
  onOpenChange,
}: SaveDraftButtonProps) {
  const { projectID } = useParams();
  const { data, isFetched } = useSelectCurrentUserSessionHook();
  const [isSaving, setIsSaving] = useState(false);

  const isDisabled = useMemo(
    () => isPending || isSaving || !isFetched,
    [isPending, isSaving, isFetched]
  );

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);

      // Get current form data
      const formData = form.getValues();

      // Create draft data
      const draftData = createDraftData(projectID as string, formData, images);

      // Generate draft key
      const key =
        draftKey || `draft_${data?.user.id}_${new Date().toISOString()}`;

      // Save draft
      await upsertDraft(key, draftData);
      toast.success("Draft saved successfully");
      onOpenChange();
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
