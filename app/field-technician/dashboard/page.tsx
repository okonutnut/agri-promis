"use client";

import dynamic from "next/dynamic";
import { useSelectUserDashboardItemsHook } from "@/components/hooks";
import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
const UserActivityLogs = dynamic(
  () => import("./components/user-activity-logs"),
  { ssr: false }
);
const UserDashboardItems = dynamic(
  () => import("@/components/custom/dashboard/user/user-dashboard-items"),
  { ssr: false }
);

export default function Dashboard() {
  const { data, isLoading, error } = useSelectUserDashboardItemsHook();
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
