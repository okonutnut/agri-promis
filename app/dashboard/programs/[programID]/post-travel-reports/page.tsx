"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { PostTravelReportType, TravelOrderType } from "@/components/types";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllTravelOrdersByProgramIDAction } from "@/app/actions/TravelOrderAction";
import { PostTravelForm } from "./components/post-travel-form";
import { SelectAllPostTravelReportsByProgramIDAction } from "@/app/actions/PostTravelAction";

type PostTravelContentProps = {
  values: PostTravelReportType[] | undefined;
};
function PostTravelContent({ values }: PostTravelContentProps) {
  const { openSheet } = useSheet();

  const handleRowSelect = (row: PostTravelReportType) => {
    openSheet(
      "View Post-Travel Report Details",
      <PostTravelForm data={row} key={`view-${row.id}`} />
    );
  };

  // const handleAdd = () => {
  //   openSheet(
  //     "Issue Post-Travel Report",
  //     <IssueTravelOrderForm isAddMode={true} values={null} key="add-mode" />
  //   );
  // };

  if (!values) return null;

  return (
    <DataTable
      columns={columns}
      data={values || []}
      onRowSelect={handleRowSelect}
    />
  );
}

export default function PostTravelReportsPage() {
  const { programID } = useParams();
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["post_travel_reports", programID as string],
    queryFn: () =>
      SelectAllPostTravelReportsByProgramIDAction(programID as string),
    table: "post_travel",
  });

  return (
    <CustomPageLayout
      pageTitle="Post-Travel Reports"
      pageDescription="View & Manage Post-Travel Reports for Field Operators."
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <PostTravelContent values={data ?? undefined} />
    </CustomPageLayout>
  );
}
