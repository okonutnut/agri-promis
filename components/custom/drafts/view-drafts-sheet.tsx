"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSheet } from "@/components/custom/layout/custom-page-layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { loadDrafts } from "@/hooks/use-draft";
import type { DraftType } from "@/hooks/use-draft";
import { format } from "date-fns";
import { Archive, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSupabaseSession } from "@/hooks/use-session";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Draft = Record<string, any>;

export type ViewDraftsSheetProps = {
  handleModify: (draft: Draft | null) => void;
  /** Which draft type to load. Omit to load all drafts (use filterFn for further narrowing). */
  draftType?: DraftType;
  /** Extract the display title from a draft. */
  getTitle: (draft: Draft) => string;
  /** Return the type-specific strings to include in search (date is always included). */
  getSearchTerms: (draft: Draft) => string[];
  /** Optional extra filter applied after draftType filtering (e.g. filter by locationID). */
  filterFn?: (draft: Draft) => boolean;
};

function DraftsContent({
  handleModify,
  draftType,
  getTitle,
  getSearchTerms,
  filterFn,
}: ViewDraftsSheetProps) {
  const { data } = useSupabaseSession();
  const [allDrafts, setAllDrafts] = useState<Draft[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (data?.user?.id) {
      loadDrafts(data.user.id as string, draftType).then(setAllDrafts);
    }
  }, [data?.user?.id, draftType]);

  // Apply optional extra filter (e.g. monitoring's locationID check) separately
  // so filterFn reference changes don't trigger re-fetches.
  const drafts = useMemo(
    () => (filterFn ? allDrafts.filter(filterFn) : allDrafts),
    [allDrafts, filterFn],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return drafts;
    return drafts.filter((d) => {
      const date = d.created_at
        ? format(new Date(d.created_at), "PPp").toLowerCase()
        : "";
      const terms = [date, ...getSearchTerms(d).map((s) => s.toLowerCase())];
      return terms.some((s) => s.includes(q));
    });
  }, [drafts, query, getSearchTerms]);

  return (
    <>
      <div className="relative px-1 pb-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search drafts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Table>
        <TableCaption className="text-xs">
          {filtered.length === 0
            ? query
              ? "No drafts match your search."
              : "No drafts saved yet."
            : "All drafts are only saved locally in the device."}
        </TableCaption>
        <TableBody>
          {filtered.map((draft) => (
            <TableRow
              key={`${draft.key}-${draft.created_at}`}
              className="border-b"
            >
              <TableCell>
                <span className="truncate block max-w-md">
                  {getTitle(draft)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Date:{" "}
                  {format(new Date(draft.created_at ?? new Date()), "PPp")}
                </span>
              </TableCell>
              <TableCell className="text-end">
                <Button size="sm" onClick={() => handleModify(draft)}>
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

export default function ViewDraftsSheet(props: ViewDraftsSheetProps) {
  const { openSheet } = useSheet();

  return (
    <Button
      variant="outline"
      onClick={() => openSheet("My Drafts", <DraftsContent {...props} />)}
      className="cursor-pointer"
    >
      <Archive className="mr-2 h-4 w-4" />
      Drafts
    </Button>
  );
}
