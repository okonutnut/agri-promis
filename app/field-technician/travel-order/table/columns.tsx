"use client";

import { TravelOrderType } from "@/components/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<TravelOrderType>[] = [
  {
    accessorKey: "travel_order_no",
    header: "Travel Order No",
  },
  {
    accessorKey: "user.fullname",
    header: "Issued To",
  },
  {
    accessorKey: "destination",
    header: "Destination",
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
          "PPp"
        )}
      </div>
    ),
  },
];
