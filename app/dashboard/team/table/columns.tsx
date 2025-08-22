"use client";

import { UserProfileType } from "@/components/types";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<UserProfileType>[] = [
  {
    id: "no",
    header: "#",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "fullname",
    header: "Fullname",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "role",
    header: "System Role",
    cell: ({ getValue }) => {
      const role = getValue() as number;
      return <div>{role === 1 ? "System Admin" : "System User"}</div>;
    },
  },
  {
    accessorKey: "active_status",
    header: "Active Status",
    cell: ({ getValue }) => {
      const status = getValue() as number;
      return (
        <Badge
          className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
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
