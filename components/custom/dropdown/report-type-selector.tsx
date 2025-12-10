"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { SelectAllReportTypesAction } from "@/app/actions/ReportTypeAction";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { ReportType } from "@/components/types";

type ReportTypeSelectorProps = { onSelect?: (reportType: ReportType) => void };
export default function ReportTypeSelector({
  onSelect,
}: ReportTypeSelectorProps) {
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["report-types"],
    queryFn: () => SelectAllReportTypesAction(),
    table: "report_type",
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isLoading ?? error}>
          New Report <ChevronDown className="text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {data?.map((r, index: number) => (
          <DropdownMenuItem
            className="text-start"
            key={index}
            onClick={() => onSelect?.(r)}
          >
            {r.description}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
