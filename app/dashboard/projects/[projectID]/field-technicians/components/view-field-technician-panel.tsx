"use client";

import dynamic from "next/dynamic";
import { AssignedProjectsType } from "@/components/types";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import FTTravelOrders from "./ft-travel-orders";
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
      <FTTravelOrders user_id={selectedRow?.user_id as string} />
      <CustomSheetFooter>
        <RemoveFTButton userID={selectedRow?.user_id as string} />
      </CustomSheetFooter>
    </section>
  );
}
