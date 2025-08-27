"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MonitoringReportType } from "@/components/types";

export const columns: ColumnDef<MonitoringReportType>[] = [
  {
    id: "count",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "travel_order.travel_order_no",
    header: "Travel Order No.",
    meta: { className: "w-32" },
  },
  {
    accessorKey: "reporter.fullname",
    header: "Reporter Name",
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
  },
  {
    accessorKey: "remarkBy.fullname",
    header: "Reviewed By",
    cell: ({ getValue }) => getValue() || "Not Reviewed",
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-end">Date Submitted</div>,
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
