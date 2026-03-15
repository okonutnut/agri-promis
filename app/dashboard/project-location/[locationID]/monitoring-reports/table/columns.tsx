"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MonitoringReportType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<MonitoringReportType>[] = [
  {
    id: "count",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "travel_order.travel_order_no",
    header: "Travel Order No.",
  },
  {
    accessorKey: "reporter.fullname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Fullname
          <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />
        </Button>
      );
    },
    enableSorting: true,
  },
  {
    id: "photo_docs",
    header: "Photo Docs",
    cell: ({ row }) => {
      const photoUrl = row.original.photo_url;
      const hasPhoto =
        Array.isArray(photoUrl) &&
        photoUrl.some(
          (item) => typeof item === "string" && item.trim().length > 0,
        );

      return (
        <Badge variant={hasPhoto ? "default" : "secondary"}>
          {hasPhoto ? "w/ Photo" : "No Photo"}
        </Badge>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "reviewedBy.fullname",
    header: "Reviewed By",
    cell: (row) => String(row.getValue() || "Not Reviewed"),
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-end">Date Created</div>,
    cell: ({ getValue }) => (
      <div className="text-end">
        {format(
          new Date(
            new Date(getValue() as string).getTime() + 8 * 60 * 60 * 1000,
          ),
          "PPpp",
        )}
      </div>
    ),
  },
];
