import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { ReactNode } from "react";

type CustomSheetFooterProps = {
  isPending?: boolean;
  children?: ReactNode;
};
export default function CustomSheetFooter({
  isPending,
  children,
}: CustomSheetFooterProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 border-t h-12 p-2 flex flex-row justify-end gap-2 z-20 bg-background">
      <SheetClose asChild>
        <Button variant={"outline"} size={"sm"} disabled={isPending}>
          Close
        </Button>
      </SheetClose>
      {children}
    </div>
  );
}
