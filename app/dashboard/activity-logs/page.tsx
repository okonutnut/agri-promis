"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { useSelectAllActivityLogsHook } from "@/components/hooks";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";

export default function ActivityLogsPage() {
  const { data, isLoading, error } = useSelectAllActivityLogsHook();

  return (
    <CustomPageLayout
      pageTitle="Activity Logs"
      isLoading={isLoading}
      error={error}
      navItems={getDashboardNavItems()}
    >
      <DataTable columns={columns} data={data || []} />
    </CustomPageLayout>
  );
}
