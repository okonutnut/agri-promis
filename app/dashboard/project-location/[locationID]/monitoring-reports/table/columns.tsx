"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MonitoringReportType } from "@/components/types";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Image as ImageIcon,
  ImageOff as ImageOffIcon,
} from "lucide-react";
import ViewSummaryButton from "@/components/custom/reports/view-summary-button";

export const columns: ColumnDef<MonitoringReportType>[] = [
  {
    id: "view_summary",
    header: "",
    cell: ({ row }) => {
      const photos = row.original.photo_url;
      const hasPhoto =
        Array.isArray(photos) &&
        photos.some(
          (photo) => typeof photo === "string" && photo.trim().length > 0,
        );

      return (
        <div className="w-14 flex items-center gap-1">
          <ViewSummaryButton
            reportType="monitoring"
            reportData={row.original}
            title="Monitoring Report Summary"
            className="h-8 w-8 p-0"
            iconOnly
            buttonVariant="ghost"
          />
          {hasPhoto ? (
            <ImageIcon
              className="h-4 w-4 text-primary"
              aria-hidden="true"
              focusable="false"
            />
          ) : (
            <ImageOffIcon
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
              focusable="false"
            />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "travel_order.travel_order_no",
    header: "Travel Order No.",
  },
  {
    accessorKey: "reporter.fullname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Fullname
          <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />
        </Button>
      );
    },
    enableSorting: true,
  },

  {
    accessorKey: "reviewedBy.fullname",
    header: "Reviewed By",
    cell: (row) => String(row.getValue() || "Not Reviewed"),
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-end">Date Created</div>,
    cell: ({ getValue }) => (
      <div className="text-end">
        {format(
          new Date(
            new Date(getValue() as string).getTime() + 8 * 60 * 60 * 1000,
          ),
          "PPpp",
        )}
      </div>
    ),
  },
];
