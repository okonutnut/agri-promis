"use client";

import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import UserProfileForm from "./user-profile-form";
import { getUserProfileNavItems } from "@/components/sidebar/navitems";

export default function UserProfileContent() {
  return (
    <CustomPageLayout
      pageTitle="User Profile"
      pageDescription="Manage your user profile and account settings."
      navItems={getUserProfileNavItems()}
    >
      <UserProfileForm />
    </CustomPageLayout>
  );
}
