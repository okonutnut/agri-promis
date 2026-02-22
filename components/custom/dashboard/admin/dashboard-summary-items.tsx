"use client";

import { FileStack } from "lucide-react";
import SummaryCard from "@/components/custom/card/summary-cards";
import { useParams } from "next/navigation";
import { SelectDashboardItemsAction } from "@/app/actions/DashboardAction";
import { useUniversalRealtime } from "@/hooks/use-universal-realtime";

export default function ProjectDashboardItems() {
  const params = useParams();
  const projectLocationID = (params.projectID || params.locationID) as string;

  const { data, isLoading, error } = useUniversalRealtime({
    queryKey: ["dashboard_items", projectLocationID],
    queryFn: () => SelectDashboardItemsAction(projectLocationID),
    tables: ["projects", "farmers", "project_location"],
  });

  return (
    <>
      {/* <SummaryCard
        title="Progress"
        description="Current Project Stage"
        icon={ChartLine}
        isLoading={isLoading || error ? true : false}
      >
        <Suspense fallback={<Skeleton className="h-6 w-20" />}>
          <strong className="text-xl">
            {cornGrowthStages.find(
              (stage) => stage.value === data?.pi?.toString(),
            )?.label ?? "Not Set"}
          </strong>
        </Suspense>
      </SummaryCard> */}
      <SummaryCard
        title="Reports"
        description="Total Reports Submitted"
        icon={FileStack}
        isLoading={isLoading || error ? true : false}
        className="h-full"
      >
        <strong className="text-4xl">{data?.m?.length ?? 0}</strong>
      </SummaryCard>
    </>
  );
}
