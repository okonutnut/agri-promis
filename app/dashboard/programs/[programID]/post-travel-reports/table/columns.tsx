"use client";

import { PostTravelWithDetails } from "@/app/types";
import ViewSummaryButton from "@/components/custom/reports/view-summary-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowUpDown,
  Image as ImageIcon,
  ImageOff as ImageOffIcon,
} from "lucide-react";

export const columns: ColumnDef<PostTravelWithDetails>[] = [
  {
    id: "view_summary",
    header: "",
    cell: ({ row }) => {
      const photos = row.original.photo_url;
      const hasPhoto =
        Array.isArray(photos) &&
        photos.some(
          (photo) => typeof photo === "string" && photo.trim().length > 0,
        );

      return (
        <div
          className="w-14 flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ViewSummaryButton
            reportType="post-travel"
            reportId={row.original.id}
            buttonLabel="View summary"
            className="h-8 w-8 p-0"
            iconOnly
            buttonVariant="ghost"
          />
          {hasPhoto ? (
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ImageOffIcon className="h-4 w-4 text-muted-foreground" />
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
      const maxLength = 40;
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
    header: () => {
      return <div className="text-end">Date Created</div>;
    },
    cell: ({ getValue }) => (
      <div className="text-end">
        {getValue() ? format(new Date(getValue() as string), "PPp") : "N/A"}
      </div>
    ),
  },
];
