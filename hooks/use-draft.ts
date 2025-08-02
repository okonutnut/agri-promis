import localforage from "localforage";

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

// Load all drafts
export const loadDrafts = async (userId: string) => {
  const keys = await localforage.keys();
  const draftKeys = keys.filter((key) => key.startsWith(`draft_${userId}_`));
  return Promise.all(draftKeys.map((key) => localforage.getItem(key)));
};

// Delete a draft
export const deleteDraft = async (draftId: string) => {
  await localforage.removeItem(draftId);
};
