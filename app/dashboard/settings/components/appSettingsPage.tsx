"use client";

import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import PostTravelPrintCard from "./postTravelPrint";

export default function AppSettingsComponent() {
  return (
    <CustomPageLayout
      pageTitle="Settings"
      pageDescription="Manage System Settings"
      navItems={getDashboardNavItems()}
    >
      <div className="space-y-4">
        <PostTravelPrintCard />
      </div>
    </CustomPageLayout>
  );
}
