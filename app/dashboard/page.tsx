"use client";

import AdminDashboardItems from "@/components/custom/dashboard/admin/admin-dashboard-items";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import { format } from "date-fns/format";
import { CustomTabList } from "@/components/custom/layout/custom-tab-list";
import TravelOrdersAnalytics from "@/components/custom/dashboard/admin/travel-orders-analytics";
import FCAAnalytics from "@/components/custom/dashboard/admin/fca-analytics";

export default function DashboardPage() {
  return (
    <CustomPageLayout
      pageTitle="Dashboard"
      pageDescription={`As of ${format(new Date(), "PPp")}`}
      navItems={getDashboardNavItems()}
    >
      <CustomTabList
        tabs={[
          {
            title: "Overview",
            content: <AdminDashboardItems />,
          },
          {
            title: "Travel Orders",
            content: <TravelOrdersAnalytics />,
          },
          {
            title: "FCA",
            content: <FCAAnalytics />,
          },
        ]}
      />
    </CustomPageLayout>
  );
}
