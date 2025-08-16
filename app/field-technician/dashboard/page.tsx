"use client";

import { useSelectUserDashboardItemsHook } from "@/components/hooks";
import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import UserDashboardItems from "@/components/custom/dashboard/user/user-dashboard-items";

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
    </CustomPageLayout>
  );
}
