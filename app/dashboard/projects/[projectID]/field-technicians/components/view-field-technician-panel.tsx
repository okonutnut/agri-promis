"use client";

import { Button } from "@/components/ui/button";
import { SheetFooter, SheetClose } from "@/components/ui/sheet";
import FTGPSCard from "./gps/gps-card";
import { AssignedProjectsType } from "@/components/types";
import { useRef, useState } from "react";
import RemoveFTButton from "./remove-ft/remove-ft-button";

type ViewFieldTechnicianPanelProps = {
  selectedRow: AssignedProjectsType | null;
};
export default function ViewFieldTechnicianPanel({
  selectedRow,
}: ViewFieldTechnicianPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <section className="p-2 space-y-4 overflow-y-auto h-[calc(100vh)]">
        <FTGPSCard user_id={selectedRow?.user_id as string} />
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
          closeBtnRef={closeBtnRef}
          setIsLoading={setIsLoading}
        />
      </SheetFooter>
    </>
  );
}
