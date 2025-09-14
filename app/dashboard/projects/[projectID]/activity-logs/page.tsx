"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectActivityLogsByProjectIDAction } from "@/app/actions/ActivityLogAction";
import { useParams } from "next/navigation";

export default function ActivityLogsPage() {
  const { projectID } = useParams();
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["activity-logs"],
    table: "activity_logs",
    queryFn: () => SelectActivityLogsByProjectIDAction(projectID as string),
  });

  return (
    <CustomPageLayout
      pageTitle="Activity Logs"
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(projectID as string)}
    >
      <DataTable columns={columns} data={data ?? []} />
    </CustomPageLayout>
  );
}
