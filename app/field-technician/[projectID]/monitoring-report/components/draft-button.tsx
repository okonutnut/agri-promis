"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { ImageData } from "@/components/interfaces";
import { useState } from "react";
import { useSelectCurrentUserSessionHook } from "@/components/hooks";
import { MonitoringReportType } from "@/components/types";
import { upsertDraft } from "@/hooks/use-draft";

interface SaveDraftButtonProps {
  draftKey: string;
  form: UseFormReturn<any>;
  images: ImageData[];
  projectID: string;
  isPending: boolean;
  setIsDrafted: (isDrafted: boolean) => void;
}

export default function SaveDraftButton({
  draftKey,
  form,
  images,
  projectID,
  isPending,
  setIsDrafted,
}: SaveDraftButtonProps) {
  const { data, isFetched } = useSelectCurrentUserSessionHook();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);

      // Get current form data
      const formData = form.getValues();

      // Process images for storage
      const processedImages = await Promise.all(
        images.map(async (img) => {
          return {
            id: img.id,
            src: img.src,
            dateTimeCaptured: img.dateTimeCaptured,
            file: img.file,
          };
        })
      );

      // Create draft object with all necessary data
      const draftData: MonitoringReportType = {
        project_id: projectID,
        images: processedImages,
        purpose: formData.purpose || "",
        findings: formData.findings || [],
        observation: formData.observation,
        issues_concern: formData.issues_concern || [],
        remarks: formData.remarks || "",
        created_at: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Manila",
        }),
      };

      const key =
        draftKey || `draft_${data?.user.id}_${new Date().toISOString()}`;

      await upsertDraft(key, draftData);
      toast.success("Draft saved successfully");
      setIsDrafted(true);
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      variant={isPending || isSaving ? "ghost" : "outline"}
      disabled={isPending || isSaving || !isFetched}
      onClick={handleSaveDraft}
      type="button"
      size={"sm"}
    >
      {isSaving ? <Loader2 className="animate-spin" /> : "Save as Draft"}
    </Button>
  );
}
