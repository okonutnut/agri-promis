"use client";

import { BookOpen, FolderKanban, Users } from "lucide-react";
import { useUniversalRealtime } from "@/hooks/use-universal-realtime";
import { SelectAdminDashboardItemsAction } from "@/app/actions/DashboardAction";
import ProjectQuickAccessCard from "./project-quick-access-card";
import TotalProjectsPerProgram from "@/components/custom/charts/total-project-per-program";
import TotalUsersPerType from "@/components/custom/charts/user-type-count";
import SummaryCard from "@/components/custom/card/summary-cards";
import ScheduledMonitoringTable from "./scheduled-monitoring-table";
import RecentActivities from "./recent-activities-admin";

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div className="col-start-1 row-start-1 md:col-start-1 md:row-start-1 md:col-span-1 md:row-span-1 h-[250px]">
        <SummaryCard
          isLoading={isLoading}
          title="Program"
          description="Total Programs"
          icon={BookOpen}
        >
          <strong className="text-4xl">{data?.totalPrograms ?? 0}</strong>
        </SummaryCard>
      </div>

      <div className="col-start-1 row-start-2 md:col-start-2 md:row-start-1 md:col-span-1 md:row-span-1 h-[250px]">
        <SummaryCard
          isLoading={isLoading}
          title="Projects"
          description="Total Projects"
          icon={FolderKanban}
        >
          <strong className="text-4xl">{data?.totalProjects ?? 0}</strong>
        </SummaryCard>
      </div>

      <div className="col-start-1 row-start-3 md:col-start-3 md:row-start-1 md:col-span-1 md:row-span-1 h-[250px]">
        <SummaryCard
          isLoading={isLoading}
          title="Team"
          description="Total Team Members"
          icon={Users}
        >
          <strong className="text-4xl">{data?.totalUsers ?? 0}</strong>
        </SummaryCard>
      </div>

      <div className="col-start-1 row-start-4 md:col-start-1 md:row-start-2 md:col-span-2 md:row-span-1 h-[250px]">
        <div className="col-span-1 row-span-1 flex items-center justify-center">
          <ScheduledMonitoringTable data={data?.futureTravelOrders ?? []} />
        </div>
      </div>

      <div className="col-start-1 row-start-5 md:col-start-3 md:row-start-2 md:col-span-1 md:row-span-1 h-[250px]">
        <div className="col-span-1 row-span-1 flex items-center justify-center">
          <ProjectQuickAccessCard />
        </div>
      </div>

      <div className="col-start-1 row-start-6 md:col-start-1 md:row-start-3 md:col-span-1 md:row-span-1">
        <div className="col-span-1 row-span-1 flex items-center justify-center">
          <TotalUsersPerType />
        </div>
      </div>

      <div className="col-start-1 row-start-7 md:col-start-2 md:row-start-3 md:col-span-2 md:row-span-1">
        <div className="col-span-1 row-span-1 flex items-center justify-center">
          <TotalProjectsPerProgram />
        </div>
      </div>

      <div className="col-start-1 row-start-8 md:col-start-1 md:row-start-4 md:col-span-3 md:row-span-1">
        <div className="col-span-1 row-span-1 flex items-center justify-center">
          <RecentActivities data={data?.recentActivityLogs ?? []} />
        </div>
      </div>
    </div>
  );
}
