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
    <CustomPageLayout
      pageTitle="Dashboard"
      pageDescription={`As of ${new Date().toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })} @ ${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`}
      navItems={getDashboardNavItems()}
    >
      <AdminDashboardItems />
    </CustomPageLayout>
  );
}
