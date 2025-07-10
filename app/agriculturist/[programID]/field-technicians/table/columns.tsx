"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserProfile } from "../types";

export const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "fullname",
    header: "Fullname",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-end">Date Created</div>,
    cell: ({ getValue }) => (
      <div className="text-end">{getValue() as string}</div>
    ),
  },
];
