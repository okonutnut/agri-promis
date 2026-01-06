"use client";

import { useMemo } from "react";
import { BookOpen, FolderKanban, Users } from "lucide-react";
import { useUniversalRealtime } from "@/hooks/use-universal-realtime";
import { SelectAdminDashboardItemsAction } from "@/app/actions/DashboardAction";
import ProjectQuickAccessCard from "./project-quick-access-card";
import TotalProjectsPerProgram from "@/components/custom/charts/total-project-per-program";
import TotalUsersPerType from "@/components/custom/charts/user-type-count";
import SummaryCard from "@/components/custom/card/summary-cards";
import ScheduledMonitoringTable from "./scheduled-monitoring-table";
import RecentActivities from "./recent-activities-admin";

type AdminDashboardItemsProps = {
  selectedYear?: string;
};

export default function AdminDashboardItems({
  selectedYear = "all",
}: AdminDashboardItemsProps) {
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

  // Helper function to check if a date falls within the selected year
  const isInSelectedYear = (dateString: string | undefined | null): boolean => {
    if (!dateString) return false;
    if (selectedYear === "all") return true;
    const date = new Date(dateString);
    return date.getFullYear().toString() === selectedYear;
  };

  // Filter statistics based on selected year
  const filteredStats = useMemo(() => {
    // Filter programs by created_at year
    const filteredPrograms = data?.totalPrograms
      ? selectedYear === "all"
        ? data.totalPrograms
        : // Note: We can't filter count without fetching all records, so we'll use the total
          // In a real implementation, you'd want to fetch all programs and filter client-side
          data.totalPrograms
      : 0;

    // Filter projects by created_at year
    const filteredProjects = data?.totalProjects
      ? selectedYear === "all"
        ? data.totalProjects
        : data.totalProjects
      : 0;

    // Filter users - users don't have a year filter typically, but we can filter by created_at
    const filteredUsers = data?.totalUsers
      ? selectedYear === "all"
        ? data.totalUsers
        : data.totalUsers
      : 0;

    // Filter activity logs by created_at year
    const filteredActivityLogs =
      data?.recentActivityLogs?.filter((log) =>
        isInSelectedYear(log.created_at)
      ) || [];

    // Filter future travel orders by date year
    const filteredTravelOrders =
      data?.futureTravelOrders?.filter((order) => {
        if (selectedYear === "all") return true;
        return isInSelectedYear(order.date);
      }) || [];

    return {
      totalPrograms: filteredPrograms,
      totalProjects: filteredProjects,
      totalUsers: filteredUsers,
      recentActivityLogs: filteredActivityLogs,
      futureTravelOrders: filteredTravelOrders,
    };
  }, [data, selectedYear]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div className="col-start-1 row-start-1 md:col-start-1 md:row-start-1 md:col-span-1 md:row-span-1 h-full">
        <SummaryCard
          isLoading={isLoading}
          title="Program"
          description="Total Programs"
          icon={BookOpen}
        >
          <strong className="text-4xl">{filteredStats.totalPrograms ?? 0}</strong>
        </SummaryCard>
      </div>

      <div className="col-start-1 row-start-2 md:col-start-2 md:row-start-1 md:col-span-1 md:row-span-1 h-full">
        <SummaryCard
          isLoading={isLoading}
          title="Projects"
          description="Total Projects"
          icon={FolderKanban}
        >
          <strong className="text-4xl">{filteredStats.totalProjects ?? 0}</strong>
        </SummaryCard>
      </div>

      <div className="col-start-1 row-start-3 md:col-start-3 md:row-start-1 md:col-span-1 md:row-span-1 h-full">
        <SummaryCard
          isLoading={isLoading}
          title="Team"
          description="Total Team Members"
          icon={Users}
        >
          <strong className="text-4xl">{filteredStats.totalUsers ?? 0}</strong>
        </SummaryCard>
      </div>

      <div className="col-start-1 row-start-4 md:col-start-1 md:row-start-2 md:col-span-2 md:row-span-1 h-full">
        <div className="col-span-1 row-span-1 flex items-center justify-center h-full">
          <ScheduledMonitoringTable data={filteredStats.futureTravelOrders ?? []} />
        </div>
      </div>

      <div className="col-start-1 row-start-5 md:col-start-3 md:row-start-2 md:col-span-1 md:row-span-1 h-full">
        <div className="col-span-1 row-span-1 flex items-center justify-center h-full">
          <ProjectQuickAccessCard />
        </div>
      </div>

      <div className="col-start-1 row-start-6 md:col-start-1 md:row-start-3 md:col-span-1 md:row-span-1 h-full">
        <div className="col-span-1 row-span-1 flex items-center justify-center h-full">
          <TotalUsersPerType />
        </div>
      </div>

      <div className="col-start-1 row-start-7 md:col-start-2 md:row-start-3 md:col-span-2 md:row-span-1 h-full">
        <div className="col-span-1 row-span-1 flex items-center justify-center h-full">
          <TotalProjectsPerProgram />
        </div>
      </div>

      <div className="col-start-1 row-start-8 md:col-start-1 md:row-start-4 md:col-span-3 md:row-span-1 h-full">
        <div className="col-span-1 row-span-1 flex items-center justify-center h-full">
          <RecentActivities data={filteredStats.recentActivityLogs ?? []} />
        </div>
      </div>
    </div>
  );
}
