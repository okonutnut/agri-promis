"use client";

import dynamic from "next/dynamic";
import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { useUniversalRealtime } from "@/hooks/use-universal-realtime";
import { SelectUserDashboardItemsAction } from "@/app/actions/DashboardAction";
const UserActivityLogs = dynamic(
  () => import("./components/user-activity-logs"),
  { ssr: false }
);
const UserDashboardItems = dynamic(
  () => import("@/components/custom/dashboard/user/user-dashboard-items"),
  { ssr: false }
);

export default function Dashboard() {
  const { data, isLoading, error } = useUniversalRealtime({
    queryKey: ["user-dashboard-items"],
    queryFn: () => SelectUserDashboardItemsAction(),
    tables: ["travel_order", "assigned_projects", "monitoring"],
  });

  return (
    <CustomPageLayout
      pageTitle="Dashboard"
      navItems={getUserDashboardNavItems()}
      isLoading={isLoading}
      error={error}
      role="user"
    >
      <UserDashboardItems data={data} isLoading={isLoading} />
      <UserActivityLogs />
    </CustomPageLayout>
  );
}
