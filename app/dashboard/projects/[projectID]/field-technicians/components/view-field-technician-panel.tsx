"use client";

import dynamic from "next/dynamic";
import { AssignedProjectsType } from "@/components/types";
import { SheetFooterSlot } from "@/components/custom/layout/custom-page-layout";
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
      <SheetFooterSlot>
        <RemoveFTButton userID={selectedRow?.user_id as string} />
      </SheetFooterSlot>
    </section>
  );
}
