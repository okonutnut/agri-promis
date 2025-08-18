"use client";

import dynamic from "next/dynamic";
import { useSelectDashboardItemsHook } from "@/components/hooks";
import { ChartLine, Contact, FileStack } from "lucide-react";
import { ChartRadialText } from "../project-progress-chart";
const SummaryCard = dynamic(() => import("../../card/summary-cards"), {
  ssr: false,
});

type ProjectDashboardItemsProps = {
  projectID: string;
};
export default function ProjectDashboardItems({
  projectID,
}: ProjectDashboardItemsProps) {
  const { data, isLoading, error } = useSelectDashboardItemsHook(
    projectID as string
  );

  return (
    <section className="flex flex-wrap md:flex-nowrap justify-between gap-5 p-4">
      <SummaryCard
        title="Progress"
        description="Total Project Progress"
        icon={ChartLine}
        isLoading={isLoading || error ? true : false}
      >
        <ChartRadialText />
      </SummaryCard>
      <SummaryCard
        title="Operators"
        description="Total Assigned Field Operators"
        icon={Contact}
        isLoading={isLoading || error ? true : false}
      >
        <strong className="text-4xl">{data?.ap?.length ?? 0}</strong>
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
