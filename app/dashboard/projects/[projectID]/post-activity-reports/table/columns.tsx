"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { PostActivityReportType } from "@/components/types";

export const columns: ColumnDef<PostActivityReportType>[] = [
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
          "PPpp"
        )}
      </div>
    ),
  },
];
