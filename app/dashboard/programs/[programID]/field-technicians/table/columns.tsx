"use client";

import { AssignedProjectsType } from "@/components/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<AssignedProjectsType>[] = [
  {
    id: "count",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "user_profile.fullname",
    header: () => <div className="w-1/2">Fullname</div>,
  },
  {
    accessorKey: "user_profile.position",
    header: "Position",
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

