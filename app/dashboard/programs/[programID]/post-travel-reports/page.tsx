"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { PostTravelForm } from "./components/post-travel-form";
import { SelectAllPostTravelReportsByProgramIDAction } from "@/app/actions/PostTravelAction";
import { CreatePostTravelForm } from "@/app/field-technician/post-travel-reports/components/create-post-travel-form";
import { PostTravelWithDetails } from "@/app/types";
import ViewDraftsSheet from "@/components/custom/drafts/view-drafts-sheet";

type PostTravelContentProps = {
  values: PostTravelWithDetails[] | undefined;
};
function PostTravelContent({ values }: PostTravelContentProps) {
  const { openSheet } = useSheet();

  const handleRowSelect = (row: PostTravelWithDetails) => {
    openSheet(
      "View Post-Travel Report Details",
      <PostTravelForm data={row} key={`view-${row.id}`} />,
    );
  };

  const handleAdd = () => {
    openSheet(
      "Issue Post-Travel Report",
      <CreatePostTravelForm isAddMode={true} key="add-mode" />,
    );
  };

  const handleModify = (row: any) => {
    openSheet(
      "Modify Post-Travel Draft",
      <CreatePostTravelForm
        isAddMode={true}
        isDraft={true}
        values={row}
        key={`draft-${row?.key}`}
      />,
    );
  };

  if (!values) return null;

  return (
    <DataTable
      columns={columns}
      data={values || []}
      onRowSelect={handleRowSelect}
      onAdd={handleAdd}
      toolbarContent={
        <ViewDraftsSheet
          handleModify={handleModify}
          draftType="post-travel"
          getTitle={(d) =>
            d.projects_places_visited || d.activities_undertaken || "Untitled"
          }
          getSearchTerms={(d) => [
            d.projects_places_visited ?? "",
            d.activities_undertaken ?? "",
            d.travel_order_no ?? "",
          ]}
        />
      }
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
      pageTitle="Travel Reports"
      pageDescription="View & Manage Post-Travel Reports for Field Operators."
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <PostTravelContent values={data ?? undefined} />
    </CustomPageLayout>
  );
}
