"use client";

import dynamic from "next/dynamic";
import { AssignedProjectsType } from "@/components/types";
const FTGPSCard = dynamic(() => import("./gps/gps-card"), {
  ssr: false,
});
const RemoveFTButton = dynamic(() => import("./remove-ft/remove-ft-button"), {
  ssr: false,
});

type ViewFieldTechnicianPanelProps = {
  selectedRow: AssignedProjectsType | null;
};
export default function ViewFieldTechnicianPanel({
  selectedRow,
}: ViewFieldTechnicianPanelProps) {
  return (
    <section className="space-y-4 overflow-y-auto">
      <FTGPSCard user_id={selectedRow?.user_id as string} />
      <div className="px-2">
        <RemoveFTButton userID={selectedRow?.user_id as string} />
      </div>
    </section>
  );
}
