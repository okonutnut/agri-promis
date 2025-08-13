"use client";

import { useSelectCurrentUserSessionHook } from "@/components/hooks";
import { MonitoringReportType } from "@/components/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { loadDrafts } from "@/hooks/use-draft";
import { format } from "date-fns";
import { FileInput } from "lucide-react";
import { useEffect, useState } from "react";

type ViewDraftsSheetProps = {
  handleModify: (row: MonitoringReportType | null) => void;
};
export default function ViewDraftsSheet({
  handleModify,
}: ViewDraftsSheetProps) {
  const { data } = useSelectCurrentUserSessionHook();
  const [isOpen, setIsOpen] = useState(false);
  const [drafts, setDrafts] = useState<MonitoringReportType[]>([]);

  useEffect(() => {
    if (data?.user?.id) {
      async function fetchDrafts() {
        const res = await loadDrafts(data?.user?.id as string);
        setDrafts(res as MonitoringReportType[]);
      }
      fetchDrafts();
    }
  }, [data?.user?.id, isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant={"outline"} className="cursor-pointer">
          <FileInput />
          Drafts
        </Button>
      </SheetTrigger>
      <SheetContent className="w-screen md:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle>My Drafts</SheetTitle>
        </SheetHeader>
        <Table>
          <TableCaption className="text-xs">
            All drafts are only saved locally in the device.
          </TableCaption>
          <TableBody>
            {drafts.map((draft) => (
              <TableRow
                key={`${draft.key}-${draft.created_at}`}
                className="border-b"
              >
                <TableCell>
                  <span className="truncate block max-w-md">
                    {draft.purpose || "Untitled"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Date:
                    {format(new Date(draft.created_at ?? new Date()), "PPp")}
                  </span>
                </TableCell>
                <TableCell className="text-end">
                  <Button
                    size={"sm"}
                    onClick={() => {
                      handleModify(draft);
                      setIsOpen(false);
                    }}
                  >
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <SheetFooter className="border-t flex-row justify-end p-2">
          <SheetClose asChild>
            <Button variant={"outline"} size={"sm"} className="cursor-pointer">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
