"use client";

import { MonitoringReportType } from "@/components/types";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<MonitoringReportType>[] = [
  {
    id: "count",
    header: "#",
    cell: (info) => info.row.index + 1,
    enableSorting: false,
    enableColumnFilter: false,
    size: 10,
  },
  {
    accessorKey: "travel_order.travel_order_no",
    header: "Travel Order No",
  },
  {
    id: "photo_docs",
    header: "Photo Docs",
    accessorFn: (row) => row.photo_url,
    cell: ({ row }) => {
      const photos = row.original.photo_url;
      const hasPhoto =
        Array.isArray(photos) &&
        photos.some(
          (photo) => typeof photo === "string" && photo.trim().length > 0,
        );

      return (
        <Badge variant={hasPhoto ? "default" : "secondary"}>
          {hasPhoto ? "w/ photo" : "no photo"}
        </Badge>
      );
    },
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
