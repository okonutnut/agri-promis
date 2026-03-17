"use client";

import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllActivityLogsByCurrentUserAction } from "@/app/actions/ActivityLogAction";

export default function ActivityLogsClient() {
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["activity-logs"],
    table: "activity_logs",
    queryFn: SelectAllActivityLogsByCurrentUserAction,
  });

  return (
    <CustomPageLayout
      pageTitle="Activity Logs"
      pageDescription="View all your activity logs within the system."
      isLoading={isLoading}
      error={error}
      navItems={getUserDashboardNavItems()}
    >
      <DataTable columns={columns} data={data ?? []} />
    </CustomPageLayout>
  );
}
