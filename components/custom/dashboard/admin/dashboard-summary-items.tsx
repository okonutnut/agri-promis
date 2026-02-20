"use client";

import { ChartLine, Contact, FileStack } from "lucide-react";
import cornGrowthStages from "@/data/growth-stages.json";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
    <section className="flex flex-wrap md:flex-nowrap justify-between gap-5">
      <SummaryCard
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
      </SummaryCard>
      <SummaryCard
        title="Reports"
        description="Total Reports Submitted"
        icon={FileStack}
        isLoading={isLoading || error ? true : false}
      >
        <strong className="text-4xl">{data?.m?.length ?? 0}</strong>
      </SummaryCard>
    </section>
  );
}
