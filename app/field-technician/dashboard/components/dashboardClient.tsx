"use client";

import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { useUniversalRealtime } from "@/hooks/use-universal-realtime";
import { SelectUserDashboardItemsAction } from "@/app/actions/DashboardAction";
import UserDashboardItems from "@/components/custom/dashboard/user/user-dashboard-items";

const USER_DASHBOARD_QUERY_KEY = ["user-dashboard-items"];
const USER_DASHBOARD_TABLES = [
  "travel_order",
  "assigned_projects",
  "monitoring",
];

export default function DashboardClient() {
  const { data, isLoading, error } = useUniversalRealtime({
    queryKey: USER_DASHBOARD_QUERY_KEY,
    queryFn: SelectUserDashboardItemsAction,
    tables: USER_DASHBOARD_TABLES,
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
    </CustomPageLayout>
  );
}
