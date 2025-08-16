"use client";

import AdminDashboardItems from "@/components/custom/dashboard/admin/admin-dashboard-items";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";

export default function SchedulerPage() {
  return (
    <CustomPageLayout pageTitle="Dashboard" navItems={getDashboardNavItems()}>
      <AdminDashboardItems />
    </CustomPageLayout>
  );
}
