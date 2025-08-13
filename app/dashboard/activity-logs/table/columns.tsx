"use client";

import { ActivityLogType } from "@/components/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<ActivityLogType>[] = [
  {
    accessorKey: "user.fullname",
    header: "Fullname",
  },
  {
    accessorKey: "code",
    header: "Activity",
  },
  {
    accessorKey: "ip_address",
    header: "IP Address",
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
