"use client";

import dynamic from "next/dynamic";
import SkeletonLoading from "../../layout/skeleton-loading";
import { BookOpen, FolderKanban, Users } from "lucide-react";
import { useUniversalRealtime } from "@/hooks/use-universal-realtime";
import { SelectAdminDashboardItemsAction } from "@/app/actions/DashboardAction";
const RecentActivities = dynamic(() => import("./recent-activities-admin"), {
  ssr: false,
});
const SummaryCard = dynamic(() => import("../../card/summary-cards"), {
  ssr: false,
});
const ScheduledMonitoringTable = dynamic(
  () => import("./scheduled-monitoring-table"),
  { ssr: false }
);

export default function AdminDashboardItems() {
  const { data, isLoading } = useUniversalRealtime({
    queryKey: ["admin-dashboard-items"],
    queryFn: SelectAdminDashboardItemsAction,
    tables: [
      "user_profile",
      "programs",
      "projects",
      "travel_order",
      "activity_logs",
    ],
  });
  return (
    <>
      <section className="flex flex-wrap md:flex-nowrap justify-between gap-5">
        <SummaryCard
          isLoading={isLoading}
          title="Program"
          description="Total Programs"
          icon={BookOpen}
        >
          <strong className="text-4xl">{data?.totalPrograms ?? 0}</strong>
        </SummaryCard>
        <SummaryCard
          isLoading={isLoading}
          title="Projects"
          description="Total Projects"
          icon={FolderKanban}
        >
          <strong className="text-4xl">{data?.totalProjects ?? 0}</strong>
        </SummaryCard>
        <SummaryCard
          isLoading={isLoading}
          title="Team"
          description="Total Team Members"
          icon={Users}
        >
          <strong className="text-4xl">{data?.totalUsers ?? 0}</strong>
        </SummaryCard>
      </section>

      {/* SCHEDULED MONITORING */}
      <section className="mt-7">
        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <ScheduledMonitoringTable data={data?.futureTravelOrders ?? []} />
        )}
      </section>

      {/* RECENT ACTIVITIES */}
      <section className="mt-7">
        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <RecentActivities data={data?.recentActivityLogs ?? []} />
        )}
      </section>
    </>
  );
}
