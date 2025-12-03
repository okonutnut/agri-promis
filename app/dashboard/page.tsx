"use client";

import AdminDashboardItems from "@/components/custom/dashboard/admin/admin-dashboard-items";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import { format } from "date-fns/format";

export default function DashboardPage() {
  return (
    <CustomPageLayout
      pageTitle="Dashboard"
      pageDescription={`As of ${format(new Date(), "PPp")}`}
      navItems={getDashboardNavItems()}
    >
      <AdminDashboardItems />
    </CustomPageLayout>
  );
}
