"use client";

import { MonitoringReportType } from "@/components/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import ViewSummaryButton from "@/components/custom/reports/view-summary-button";
import { Image as LucideImage, ImageOff as LucideImageOff } from "lucide-react";

export const columns: ColumnDef<MonitoringReportType>[] = [
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
        <div className="w-14 flex items-center gap-1">
          <ViewSummaryButton
            reportType="monitoring"
            reportId={row.original.id}
            className="h-8 w-8 p-0"
            iconOnly
            buttonVariant="ghost"
          />
          {hasPhoto ? (
            <LucideImage className="h-4 w-4 text-muted-foreground" />
          ) : (
            <LucideImageOff className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
    size: 10,
  },
  {
    accessorKey: "travel_order.travel_order_no",
    header: "Travel Order No",
  },

  {
    accessorKey: "purpose",
    header: "Purpose",
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
    accessorKey: "reviewedBy.fullname",
    header: "Reviewed By",
    cell: ({ getValue }) => <div>{(getValue() as string) || "N/A"}</div>,
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-end">Date Submitted</div>,
    cell: ({ getValue }) => (
      <div className="text-end">
        {format(
          new Date(
            new Date(getValue() as string).getTime() + 8 * 60 * 60 * 1000,
          ),
          "PPp",
        )}
      </div>
    ),
  },
];
