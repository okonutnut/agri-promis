import { cn } from "@/lib/utils";

export function ContentWithPanel({
  children,
  panelOpen,
}: {
  children: React.ReactNode;
  panelOpen: boolean;
}) {
  return (
    <div
      className={cn(
        "flex-1 transition-all duration-300 p-2",
        panelOpen ? "mr-80" : "mr-0"
      )}
    >
      {children}
    </div>
  );
}
