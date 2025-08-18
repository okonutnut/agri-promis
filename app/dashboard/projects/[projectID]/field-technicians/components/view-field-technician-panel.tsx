"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { SheetFooter, SheetClose } from "@/components/ui/sheet";
import { AssignedProjectsType } from "@/components/types";
import { useRef, useState } from "react";
const FTTravelOrders = dynamic(() => import("./ft-travel-orders"), {
  ssr: false,
});
const FTGPSCard = dynamic(() => import("./gps/gps-card"), {
  ssr: false,
});
const RemoveFTButton = dynamic(() => import("./remove-ft/remove-ft-button"), {
  ssr: false,
});

type ViewFieldTechnicianPanelProps = {
  selectedRow: AssignedProjectsType | null;
  setPanelOpen: (isOpen: boolean) => void;
};
export default function ViewFieldTechnicianPanel({
  selectedRow,
  setPanelOpen,
}: ViewFieldTechnicianPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <section className="p-2 space-y-4 overflow-y-auto h-[calc(100vh)]">
        <FTGPSCard user_id={selectedRow?.user_id as string} />
        <FTTravelOrders user_id={selectedRow?.user_id as string} />
      </section>
      <SheetFooter className="border-t flex-row justify-end p-2 gap-2">
        <SheetClose asChild>
          <Button
            variant={"outline"}
            size={"sm"}
            ref={closeBtnRef}
            disabled={isLoading}
          >
            Close
          </Button>
        </SheetClose>
        <RemoveFTButton
          userID={selectedRow?.user_id as string}
          setPanelOpen={setPanelOpen}
          setIsLoading={setIsLoading}
        />
      </SheetFooter>
    </>
  );
}
