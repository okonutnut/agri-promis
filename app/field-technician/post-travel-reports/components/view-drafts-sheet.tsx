"use client";

import { Button } from "@/components/ui/button";
import { useSheet } from "@/components/custom/layout/custom-page-layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { loadDrafts } from "@/hooks/use-draft";
import { format } from "date-fns";
import { Archive } from "lucide-react";
import { useEffect, useState } from "react";
import { useSupabaseSession } from "@/hooks/use-session";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";

type PostTravelDraft = {
  key?: string;
  draft_type?: string;
  projects_places_visited?: string;
  activities_undertaken?: string;
  created_at?: string;
};

type ViewDraftsSheetProps = {
  handleModify: (row: PostTravelDraft | null) => void;
};

function DraftsContent({ handleModify }: ViewDraftsSheetProps) {
  const { data } = useSupabaseSession();
  const [drafts, setDrafts] = useState<PostTravelDraft[]>([]);

  useEffect(() => {
    if (data?.user?.id) {
      async function fetchDrafts() {
        const res = await loadDrafts(data?.user?.id as string, "post-travel");
        setDrafts(res as unknown as PostTravelDraft[]);
      }
      fetchDrafts();
    }
  }, [data?.user?.id]);

  return (
    <>
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
                  {draft.projects_places_visited ||
                    draft.activities_undertaken ||
                    "Untitled"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Date:{" "}
                  {format(new Date(draft.created_at ?? new Date()), "PPp")}
                </span>
              </TableCell>
              <TableCell className="text-end">
                <Button
                  size={"sm"}
                  onClick={() => {
                    handleModify(draft);
                  }}
                >
                  Open
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CustomSheetFooter />
    </>
  );
}

export default function ViewDraftsSheet({
  handleModify,
}: ViewDraftsSheetProps) {
  const { openSheet } = useSheet();

  const handleViewDrafts = () => {
    openSheet("My Drafts", <DraftsContent handleModify={handleModify} />);
  };

  return (
    <Button
      variant={"outline"}
      onClick={handleViewDrafts}
      className="cursor-pointer"
    >
      <Archive className="mr-2 h-4 w-4" />
      Drafts
    </Button>
  );
}
