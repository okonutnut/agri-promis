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
    header: "Travel Order No",
  },
  {
    id: "reporter_name",
    header: "Reporter Name",
    cell: ({ row }) => {
      const user = row.original.travel_order?.user;
      // Handle array or object format
      const fullname = Array.isArray(user) 
        ? user[0]?.fullname 
        : user?.fullname;
      return <span>{fullname || "N/A"}</span>;
    },
  },
  {
    id: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isReviewed = !!row.original.reviewer_id;
      return (
        <Badge variant={isReviewed ? "default" : "destructive"}>
          {isReviewed ? "Reviewed" : "Pending Review"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <div className="text-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ getValue }) => (
      <div className="text-end">
        {getValue() ? format(new Date(getValue() as string), "PPp") : "N/A"}
      </div>
    ),
  },
];
