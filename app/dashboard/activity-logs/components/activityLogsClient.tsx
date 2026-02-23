"use client";

import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllActivityLogsAction } from "@/app/actions/ActivityLogAction";

export default function ActivityLogsClient() {
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["activity-logs"],
    table: "activity_logs",
    queryFn: SelectAllActivityLogsAction,
  });

  return (
    <CustomPageLayout
      pageTitle="Activity Logs"
      pageDescription="View all activity logs within the system."
      isLoading={isLoading}
      error={error}
      navItems={getDashboardNavItems()}
    >
      <DataTable columns={columns} data={data ?? []} />
    </CustomPageLayout>
  );
}
