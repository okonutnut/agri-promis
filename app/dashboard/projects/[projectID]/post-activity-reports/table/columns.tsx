"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { PostActivityReportType } from "@/components/types";

export const columns: ColumnDef<PostActivityReportType>[] = [
  {
    accessorKey: "submittedBy.fullname",
    header: "Reporter Name",
  },
  {
    accessorKey: "travel_order_no",
    header: "Travel Order No.",
  },
  {
    accessorKey: "reviewedBy.fullname",
    header: "Reviewed By",
    cell: ({ getValue }) => {
      return getValue() ? (getValue() as string) : "Not Reviewed";
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
          "PPpp"
        )}
      </div>
    ),
  },
];
