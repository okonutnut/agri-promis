export function addProjectToQuickAccess(projectId: string) {
  let quickAccess = JSON.parse(
    localStorage.getItem("quickAccessProjects") || "[]"
  ) as string[];

  // Remove if already exists to avoid duplicates
  quickAccess = quickAccess.filter((id) => id !== projectId);

  // Add to the beginning of the array
  quickAccess.unshift(projectId);

  // Limit to 5 items
  if (quickAccess.length > 5) {
    quickAccess = quickAccess.slice(0, 5);
  }

  localStorage.setItem("quickAccessProjects", JSON.stringify(quickAccess));
  
  // Dispatch custom event to notify components of the change
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("quickAccessUpdated"));
  }
}

export function getQuickAccessProjects(): string[] {
  return JSON.parse(
    localStorage.getItem("quickAccessProjects") || "[]"
  ) as string[];
}
