"use client";

import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getUserProfileNavItems } from "@/components/sidebar/navitems";
import UserProfileForm from "./components/user-profile-form";

export default function UserPage() {
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
