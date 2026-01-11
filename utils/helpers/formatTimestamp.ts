import { format } from "date-fns";

export function formatTimestamp(
  timestamp: string | null | undefined,
  formatString: string
): string {
  if (!timestamp) return "N/A";
  const data = format(new Date(timestamp), formatString);
  return data;
}
