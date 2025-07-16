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
    accessorKey: "user_profile.fullname",
    header: "Reporter Name",
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
