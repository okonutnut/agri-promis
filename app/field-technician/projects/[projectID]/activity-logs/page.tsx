"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { getUserProjectNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectActivityLogsByProjectIDAction } from "@/app/actions/ActivityLogAction";
import { useParams } from "next/navigation";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";

export default function ActivityLogsPage() {
  const { projectID } = useParams();

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["activity-logs", projectID as string],
    table: "activity_logs",
    queryFn: () => SelectActivityLogsByProjectIDAction(projectID as string),
  });

  return (
    <CustomPageLayout
      pageTitle="Activity Logs"
      pageDescription="View all activity logs for this project."
      isLoading={isLoading}
      error={error}
      navItems={getUserProjectNavItems(projectID as string)}
    >
      <DataTable columns={columns} data={data ?? []} />
    </CustomPageLayout>
  );
}
