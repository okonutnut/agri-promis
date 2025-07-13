"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { FieldReportType } from "@/components/types";

export const columns: ColumnDef<FieldReportType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "reporter_id",
    header: "Reporter ID",
  },
  {
    accessorKey: "report_date",
    header: "Date Created",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return format(date, "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "report_time",
    header: "Time Created",
    cell: ({ getValue }) => {
      const time = new Date(`1970-01-01T${getValue() as string}`);
      return format(time, "hh:mm:ss a");
    },
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
          "MMM dd, yyyy hh:mm a"
        )}
      </div>
    ),
  },
];
