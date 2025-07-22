"use client";

import { TravelOrderType } from "@/components/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<TravelOrderType>[] = [
  {
    accessorKey: "name",
    header: "Fullname",
  },
  {
    accessorKey: "destination",
    header: "Destination",
  },
  {
    accessorKey: "program",
    header: "Program",
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-end">Date Assigned</div>,
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
