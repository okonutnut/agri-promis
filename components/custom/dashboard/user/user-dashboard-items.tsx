"use client";

import SummaryCard from "@/components/custom/card/summary-cards";
import { Activity, CheckCircle, FileStack } from "lucide-react";

type UserDashboardItemsProps = {
  data?: {
    m: any[]; // Monitoring reports
    ap: any[]; // Assigned projects
    to: any[]; // Ongoing tasks
  };
  isLoading?: boolean;
};
export default function UserDashboardItems({
  data,
  isLoading,
}: UserDashboardItemsProps) {
  return (
    <section className="flex flex-wrap md:flex-nowrap gap-2 justify-between">
      <SummaryCard
        title="Submitted"
        description="Total Monitoring Reports Submitted"
        icon={CheckCircle}
        isLoading={isLoading}
      >
        <strong className="text-3xl">{data?.m.length || 0}</strong>
      </SummaryCard>
      <SummaryCard
        title="Projects"
        description="Total Assigned Projects"
        icon={FileStack}
        isLoading={isLoading}
      >
        <strong className="text-3xl">{data?.ap.length || 0}</strong>
      </SummaryCard>
      <SummaryCard
        title="Ongoing"
        description="Current Work in Progress"
        icon={Activity}
        isLoading={isLoading}
      >
        <strong className="text-3xl">{data?.to.length || 0}</strong>
      </SummaryCard>
    </section>
  );
}
