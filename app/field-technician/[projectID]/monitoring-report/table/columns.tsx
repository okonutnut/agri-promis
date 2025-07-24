"use client";

import { MonitoringReportType } from "@/components/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<MonitoringReportType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "reviewedBy.fullname",
    header: "Reviewed By",
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
          "PPp"
        )}
      </div>
    ),
  },
];
