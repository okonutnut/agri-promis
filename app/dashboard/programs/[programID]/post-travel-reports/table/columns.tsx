"use client";

import { PostTravelReportType } from "@/components/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<PostTravelReportType>[] = [
  {
    id: "count",
    header: "#",
    cell: ({ row }) => <span className="text-center">{row.index + 1}</span>,
  },
  {
    accessorKey: "travel_order.travel_order_no",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Travel Order No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
    enableSorting: true,
  },
  {
    accessorKey: "travel_order.user.fullname",
    header: "Reporter Name",
  },
  {
    accessorKey: "reviewer_id",
    header: "Status",
    cell: ({ getValue }) => (
      <Badge variant={getValue() === null ? "destructive" : "default"}>
        {getValue() === null ? "Pending Review" : "Reviewed"}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: () => {
      return <div className="text-end">Date Submitted</div>;
    },
    cell: ({ getValue }) => (
      <div className="text-end">
        {format(new Date(getValue() as string), "PPp")}
      </div>
    ),
  },
];
