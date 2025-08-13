"use client";

import { AssignedProjectsType, UserProfileType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { UseMutateFunction } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

export const columns = (
  mutate: UseMutateFunction<void, Error, AssignedProjectsType, unknown>,
  isPending: boolean
): ColumnDef<UserProfileType>[] => [
  {
    accessorKey: "fullname",
    header: "Name",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-end" key={row.id}>
        <Button
          variant={isPending ? "ghost" : "link"}
          size="sm"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            row.getToggleSelectedHandler()(e);
            mutate({
              user_id: row.original.id,
            });
          }}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Select"}
        </Button>
      </div>
    ),
  },
];
