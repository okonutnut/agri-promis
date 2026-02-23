"use client";

import AdminDashboardItems from "@/components/custom/dashboard/admin/admin-dashboard-items";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import { CustomTabList } from "@/components/custom/layout/custom-tab-list";
import TravelOrdersAnalytics from "@/components/custom/dashboard/admin/travel-orders-analytics";
import FCAAnalytics from "@/components/custom/dashboard/admin/fca-analytics";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function DashboardClient() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) =>
        setUserName(data.user?.user_metadata.full_name || "User"),
      );
  }, []);

  return (
    <CustomPageLayout
      pageTitle="Dashboard"
      pageDescription={`Welcome back! ${userName}`}
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
