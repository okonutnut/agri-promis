"use client";

import { PostTravelWithDetails } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<PostTravelWithDetails>[] = [
  {
    id: "count",
    header: "#",
    cell: ({ row }) => <span className="text-center">{row.index + 1}</span>,
  },
  {
    accessorKey: "travel_order_no",
    header: "Travel Order No",
  },
  {
    accessorKey: "fullname",
    header: "Reporter Name",
  },
  {
    id: "photo_docs",
    header: "Photo Docs",
    cell: ({ row }) => {
      const photos = row.original.photo_url;
      const hasPhoto =
        Array.isArray(photos) &&
        photos.some(
          (photo) => typeof photo === "string" && photo.trim().length > 0,
        );

      return (
        <Badge variant={hasPhoto ? "default" : "secondary"}>
          {hasPhoto ? "w/ photo" : "no photo"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reviewed_at",
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
    cell: (row) => {
      const isReviewed = (row.getValue() as string | null) !== null;
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
