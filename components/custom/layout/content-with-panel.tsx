import { cn } from "@/lib/utils";

export function ContentWithPanel({
  panelWidth,
  children,
  panelOpen,
}: {
  panelWidth: string;
  children: React.ReactNode;
  panelOpen: boolean;
}) {
  return (
    <div
      className={cn(
        "flex-1 transition-all duration-300 p-2",
        panelOpen ? `mr-[${panelWidth ?? "300px"}]` : "mr-0"
      )}
    >
      {children}
    </div>
  );
}
