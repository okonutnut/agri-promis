"use client";

import {
  ActivityLogType,
  AssignedProjectsType,
  MonitoringReportType,
  TravelOrderType,
} from "@/components/types";
import { Activity, CheckCircle, FileStack } from "lucide-react";
import dynamic from "next/dynamic";
const UserActivityLogs = dynamic(
  () =>
    import("@/app/field-technician/dashboard/components/user-activity-logs"),
  { ssr: false }
);
const SummaryCard = dynamic(
  () => import("@/components/custom/card/summary-cards"),
  { ssr: false }
);

type UserDashboardItemsProps = {
  data?: {
    m: MonitoringReportType[];
    ap: AssignedProjectsType[];
    to: TravelOrderType[];
    al: ActivityLogType[];
  };
  isLoading?: boolean;
};
export default function UserDashboardItems({
  data,
  isLoading,
}: UserDashboardItemsProps) {
  return (
    <>
      <section className="flex flex-wrap md:flex-nowrap gap-2 justify-between mb-4">
        <SummaryCard
          title="Submitted"
          description="Total Monitoring Reports Submitted"
          icon={CheckCircle}
          isLoading={isLoading}
        >
          <strong className="text-3xl">{data?.m?.length || 0}</strong>
        </SummaryCard>
        <SummaryCard
          title="Projects"
          description="Total Assigned Projects"
          icon={FileStack}
          isLoading={isLoading}
        >
          <strong className="text-3xl">{data?.ap?.length || 0}</strong>
        </SummaryCard>
        <SummaryCard
          title="Ongoing"
          description="Current Work in Progress"
          icon={Activity}
          isLoading={isLoading}
        >
          <strong className="text-3xl">{data?.to?.length || 0}</strong>
        </SummaryCard>
      </section>
      <UserActivityLogs data={data?.al} />
    </>
  );
}
