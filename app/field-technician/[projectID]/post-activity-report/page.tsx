"use client";

import UserPageLayout from "@/components/custom/layout/user-page-layout";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";

export default function PostActivityReportPage() {
  return (
    <UserPageLayout pageTitle="My Post Activity Report">
      <DataTable columns={columns} data={[]} />
    </UserPageLayout>
  );
}
