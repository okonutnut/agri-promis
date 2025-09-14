"use client";

import { FCAType } from "@/components/types";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<FCAType>[] = [
  {
    id: "no",
    header: "#",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Name",
  },
  {
    accessorKey: "member_count",
    header: "Total Members",
  },
  {
    accessorKey: "active_status",
    header: "Active Status",
    cell: ({ getValue }) => {
      const status = getValue() as number;
      return (
        <Badge
          className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium uppercase ${
            status === 1
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status === 1 ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-end">Date Created</div>,
    cell: ({ getValue }) => (
      <div className="text-end">
        {format(new Date(new Date(getValue() as string)), "PPp")}
      </div>
    ),
  },
];
