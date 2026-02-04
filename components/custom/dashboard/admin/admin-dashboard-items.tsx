"use client";

import { useMemo } from "react";
import { BookOpen, FolderKanban, Users, Building2 } from "lucide-react";
import { useUniversalRealtime } from "@/hooks/use-universal-realtime";
import { SelectAdminDashboardItemsAction } from "@/app/actions/DashboardAction";
import TotalProjectsPerProgram from "@/components/custom/charts/total-project-per-program";
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
      "farmers",
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
  // Note: Count queries (programs, projects, users, FCAs) cannot be filtered by year without
  // fetching all records, so we display totals regardless of selectedYear
  const filteredStats = useMemo(() => {
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
      // Counts are always totals (year filtering would require fetching all records)
      totalPrograms: data?.totalPrograms ?? 0,
      totalProjects: data?.totalProjects ?? 0,
      totalUsers: data?.totalUsers ?? 0,
      totalFCAs: data?.totalFCAs ?? 0,
      // These can be filtered client-side since we have the full data
      recentActivityLogs: filteredActivityLogs,
      futureTravelOrders: filteredTravelOrders,
    };
  }, [data, selectedYear]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
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

      <div className="col-start-1 row-start-4 md:col-start-4 md:row-start-1 md:col-span-1 md:row-span-1 h-full">
        <SummaryCard
          isLoading={isLoading}
          title="FCA"
          description="Total FCAs"
          icon={Building2}
        >
          <strong className="text-4xl">{filteredStats.totalFCAs ?? 0}</strong>
        </SummaryCard>
      </div>

      <div className="col-start-1 row-start-5 md:col-start-1 md:row-start-2 md:col-span-2 md:row-span-1 h-full">
        <div className="col-span-1 row-span-1 flex flex-col h-full w-full">
          <ScheduledMonitoringTable data={filteredStats.futureTravelOrders ?? []} />
        </div>
      </div>

      <div className="col-start-1 row-start-6 md:col-start-3 md:row-start-2 md:col-span-2 md:row-span-1 h-full">
        <div className="col-span-1 row-span-1 flex flex-col h-full w-full">
          <TotalProjectsPerProgram />
        </div>
      </div>

      <div className="col-start-1 row-start-7 md:col-start-1 md:row-start-3 md:col-span-4 md:row-span-1 h-full">
        <div className="col-span-1 row-span-1 flex flex-col h-full w-full">
          <RecentActivities data={filteredStats.recentActivityLogs ?? []} />
        </div>
      </div>
    </div>
  );
}
