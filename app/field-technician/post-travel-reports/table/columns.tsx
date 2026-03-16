"use client";

import { PostTravelWithDetails } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ViewSummaryButton from "@/components/custom/reports/view-summary-button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Image, ImageOff } from "lucide-react";

export const columns: ColumnDef<PostTravelWithDetails>[] = [
  {
    id: "view_summary",
    header: "",
    cell: ({ row }) => {
      const photos = row.original.photo_url;
      const hasPhoto =
        Array.isArray(photos) &&
        photos.some((url) => typeof url === "string" && url.trim().length > 0);

      return (
        <div className="w-14 flex items-center gap-1">
          <ViewSummaryButton
            reportType="post-travel"
            reportId={row.original.id}
            className="h-8 w-8 p-0"
            iconOnly
            buttonVariant="ghost"
          />
          {hasPhoto ? (
            <Image
              className="h-4 w-4 text-muted-foreground"
              aria-label="Has photo documentation"
            />
          ) : (
            <ImageOff
              className="h-4 w-4 text-muted-foreground"
              aria-label="No photo documentation"
            />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "travel_order_no",
    header: "Travel Order No",
  },
  {
    accessorKey: "fullname",
    header: "Reporter Name",
  },
  {
    accessorKey: "activities_undertaken",
    header: "Activities Undertaken",
    cell: ({ getValue }) => {
      const value = (getValue() as string) || "N/A";
      const maxLength = 50;
      const isTruncated = value.length > maxLength;
      const displayValue = isTruncated
        ? value.slice(0, maxLength) + "..."
        : value;

      return (
        <div
          title={isTruncated ? value : undefined}
          className="truncate max-w-full whitespace-nowrap"
        >
          {displayValue}
        </div>
      );
    },
  },

  {
    accessorKey: "reviewed_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (row) => {
      const isReviewed = (row.getValue() as string | null) !== null;
      return (
        <Badge variant={isReviewed ? "default" : "destructive"}>
          {isReviewed ? "Reviewed" : "Pending Review"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <div className="text-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ getValue }) => (
      <div className="text-end">
        {getValue() ? format(new Date(getValue() as string), "PPp") : "N/A"}
      </div>
    ),
  },
];
