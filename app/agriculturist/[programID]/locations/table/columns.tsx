"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LocationType } from "../types";
import { format } from "date-fns";

export const columns: ColumnDef<LocationType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "province",
    header: "Province",
  },
  {
    accessorKey: "municipality",
    header: "Municipality",
  },
  {
    accessorKey: "barangay",
    header: "Barangay",
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
          "MMM dd, yyyy hh:mm a"
        )}
      </div>
    ),
  },
];
