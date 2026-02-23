"use client";

import { FileStack } from "lucide-react";
import SummaryCard from "@/components/custom/card/summary-cards";
import { useParams } from "next/navigation";
import { SelectDashboardItemsAction } from "@/app/actions/DashboardAction";
import { useUniversalRealtime } from "@/hooks/use-universal-realtime";

export default function ProjectDashboardItems() {
  const { locationID } = useParams();

  const { data, isLoading, error } = useUniversalRealtime({
    queryKey: ["dashboard_items", locationID as string],
    queryFn: () => SelectDashboardItemsAction(locationID as string),
    tables: ["projects", "farmers", "project_location"],
  });

  return (
    <div className="col-span-1">
      <SummaryCard
        title="Reports"
        description="Total Reports Submitted"
        icon={FileStack}
        isLoading={isLoading || error ? true : false}
        className="min-h-full"
      >
        <strong className="text-4xl">{data?.m?.length ?? 0}</strong>
      </SummaryCard>
    </div>
  );
}
