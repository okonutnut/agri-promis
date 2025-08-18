"use client";

import dynamic from "next/dynamic";
const AdminDashboardItems = dynamic(
  () => import("@/components/custom/dashboard/admin/admin-dashboard-items"),
  {
    ssr: false,
  }
);
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";

export default function DashboardPage() {
  return (
    <CustomPageLayout pageTitle="Dashboard" navItems={getDashboardNavItems()}>
      <AdminDashboardItems />
    </CustomPageLayout>
  );
}
