"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getProjectLocationNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectActivityLogsByProjectIDAction } from "@/app/actions/ActivityLogAction";
import { useParams } from "next/navigation";

export default function ActivityLogsPage() {
  const { locationID } = useParams();

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["activity-logs", locationID as string],
    table: "activity_logs",
    queryFn: () => SelectActivityLogsByProjectIDAction(locationID as string),
  });

  return (
    <CustomPageLayout
      pageTitle="Activity Logs"
      pageDescription="View and manage activity logs for the project."
      isLoading={isLoading}
      error={error}
      navItems={getProjectLocationNavItems(locationID as string)}
    >
      <DataTable columns={columns} data={data ?? []} />
    </CustomPageLayout>
  );
}
