"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MonitoringReportType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
          Uploader Name
          <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />
        </Button>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "report_type.description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Report Type
          <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />
        </Button>
      );
    },
    enableSorting: true,
    cell: ({ getValue }) => <Badge>{String(getValue() || "Unknown")}</Badge>,
  },
  {
    accessorKey: "remarkBy.fullname",
    header: "Reviewed By",
    cell: ({ getValue }) => String(getValue() || "Not Reviewed"),
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-end">Date Created</div>,
    cell: ({ getValue }) => (
      <div className="text-end">
        {format(
          new Date(
            new Date(getValue() as string).getTime() + 8 * 60 * 60 * 1000
          ),
          "PPpp"
        )}
      </div>
    ),
  },
];
