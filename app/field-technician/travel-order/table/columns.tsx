"use client";

import { TravelOrderType } from "@/components/types";
import { Badge } from "@/components/ui/badge";
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
    accessorKey: "is_active",
    header: "Status",
    cell: ({ getValue }) => {
      return (
        <Badge variant={getValue() ? "default" : "destructive"}>
          {getValue() ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-end">Date Created</div>,
    cell: ({ getValue }) => (
      <div className="text-end">
        {format(new Date(getValue() as string), "PPp")}
      </div>
    ),
  },
];
