"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { PostTravelReportType } from "@/components/types";
import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { CreatePostTravelForm } from "./components/create-post-travel-form";
import { SelectAllPostTravelReportsByCurrentUserAction } from "@/app/actions/PostTravelAction";

type PostTravelContentProps = {
  values: PostTravelReportType[] | undefined;
};
function PostTravelContent({ values }: PostTravelContentProps) {
  const { openSheet } = useSheet();

  const handleRowSelect = (row: PostTravelReportType) => {
    const title = "View Post-Travel Report Details";
    
    openSheet(
      title,
      <CreatePostTravelForm
        isAddMode={false}
        values={row}
        key={`view-${row.id}`}
      />
    );
  };

  const handleAdd = () => {
    openSheet(
      "Issue Post-Travel Report",
      <CreatePostTravelForm isAddMode={true} key="add-mode" />
    );
  };

  if (!values) return null;

  return (
    <DataTable
      columns={columns}
      data={values || []}
      onRowSelect={handleRowSelect}
      onAdd={handleAdd}
    />
  );
}

export default function PostTravelReportsPage() {
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["post_travel_reports"],
    queryFn: () => SelectAllPostTravelReportsByCurrentUserAction(),
    table: "post_travel",
  });

  return (
    <CustomPageLayout
      pageTitle="Post-Travel Reports"
      pageDescription="Create & View Post-Travel Reports."
      isLoading={isLoading}
      error={error}
      navItems={getUserDashboardNavItems()}
    >
      <PostTravelContent values={data ?? undefined} />
    </CustomPageLayout>
  );
}
