"use client";

import { AssignedProjectsType } from "@/components/types";
import { useLoading } from "@/components/custom/layout/custom-page-layout";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import FTTravelOrders from "./ft-travel-orders";
import FTGPSCard from "./gps/gps-card";
import RemoveFTButton from "./remove-ft/remove-ft-button";

type ViewFieldTechnicianPanelProps = {
  selectedRow: AssignedProjectsType | null;
};
export default function ViewFieldTechnicianPanel({
  selectedRow,
}: ViewFieldTechnicianPanelProps) {
  const { isLoading } = useLoading();

  return (
    <section className="space-y-4 overflow-y-auto">
      <FTGPSCard user_id={selectedRow?.user_id as string} />
      <FTTravelOrders user_id={selectedRow?.user_id as string} />
      <CustomSheetFooter isPending={isLoading}>
        <RemoveFTButton userID={selectedRow?.user_id as string} />
      </CustomSheetFooter>
    </section>
  );
}

