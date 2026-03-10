import { MonitoringReportType } from "@/components/types";
import localforage from "localforage";

export type DraftType = "monitoring" | "post-travel" | "travel-order";

// Save draft to IndexedDB
export const saveDraft = async (key: string, draftData: object) => {
  await localforage.setItem(key, { ...draftData, key: key });
  return key;
};

// Upsert draft (create or update)
export const upsertDraft = async (key: string, draftData: object) => {
  try {
    // Check if draft exists
    const existingDraft = await localforage.getItem(key);

    if (existingDraft) {
      // Update: merge existing data with new data
      await localforage.setItem(key, {
        ...existingDraft,
        ...draftData,
        key: key,
      });
    } else {
      // Create new
      await localforage.setItem(key, {
        ...draftData,
        key: key,
      });
    }

    return { success: true, key };
  } catch (error) {
    return { success: false, error };
  }
};

// Load all drafts, optionally filtered by draft_type
export const loadDrafts = async (
  userId: string,
  draftType?: DraftType,
) => {
  const keys = await localforage.keys();
  const draftKeys = keys.filter((key) => key.startsWith(`draft_${userId}_`));
  const drafts = await Promise.all(
    draftKeys.map(
      async (key) => (await localforage.getItem(key)) as MonitoringReportType & { draft_type?: DraftType }
    )
  );

  if (draftType) {
    return drafts.filter((d) => d.draft_type === draftType);
  }

  return drafts;
};

// Delete a draft
export const deleteDraft = async (draftId: string) => {
  await localforage.removeItem(draftId);
};
