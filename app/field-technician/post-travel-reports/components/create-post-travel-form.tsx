"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PostTravelWithDetails } from "@/app/types";
import { GenericReportForm } from "@/components/custom/forms/generic-report-form";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { CheckUserAssignedToProgramAction } from "@/app/actions/AssignedProgramAction";
import { InsertPostTravelReportAction } from "@/app/actions/PostTravelAction";
import AssignedProgramDropdown from "@/components/custom/dropdown/assigned-program-dropdown";
import { SelectAllTravelOrdersByUserIDAction } from "@/app/actions/TravelOrderAction";
import { useSupabaseSession } from "@/hooks/use-session";
import { Card } from "@/components/ui/card";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";

type CreatePostTravelFormProps = {
  isAddMode?: boolean;
  values?: PostTravelWithDetails;
};

export function CreatePostTravelForm({
  isAddMode = true,
  values,
}: CreatePostTravelFormProps) {
  const { programID } = useParams();
  const { data: userData } = useSupabaseSession();
  const [programId, setProgramId] = useState<string | null>(
    values?.program_id || (programID as string) || null,
  );

  // Get travel orders for the form
  const { data: travelOrders } = useRealtimeQuery({
    queryKey: ["travel-orders-post-travel"],
    queryFn: () =>
      userData?.user.id
        ? SelectAllTravelOrdersByUserIDAction(userData.user.id)
        : Promise.resolve([]),
    table: "travel_order",
  });

  // Check if user is assigned to the program (when programId is available)
  const { data: isAssignedToProgram } = useRealtimeQuery({
    queryKey: ["user-program-assignment-post-travel", programId || "none"],
    queryFn: () =>
      programId
        ? CheckUserAssignedToProgramAction(programId)
        : Promise.resolve(false),
    table: "assigned_fieldtechnicians",
  });

  useEffect(() => {
    if (programID) {
      setProgramId(programID as string);
    } else if (values?.program_id) {
      setProgramId(values.program_id);
    }
  }, [programID, values?.program_id]);

  // Show program selector if not in programID context
  if (isAddMode && !programId) {
    return (
      <>
        <div className="p-2">
          <AssignedProgramDropdown
            onChange={(program) => setProgramId(program)}
          />
        </div>
        <CustomSheetFooter />
      </>
    );
  }

  return (
    <GenericReportForm
      type="post-travel"
      isAddMode={isAddMode}
      values={values}
      mutationFn={async (data: any) =>
        InsertPostTravelReportAction({
          program_id: programId || undefined,
          travel_order_id: data.travel_order_id,
          travel_date_id: data.travel_date_id,
          projects_places_visited: data.projects_places_visited,
          activities_undertaken: data.activities_undertaken,
          issues_concern: data.issues_concern || [],
          remarks: data.remarks,
          images: data.images?.map((img: any) => ({ file: img.file })) || [],
        })
      }
      invalidateKeys={["post_travel_reports"]}
      onSuccess={async () => {}}
      showDrafts={false}
      enableImageCapture={true}
      programID={programId || undefined}
      travelOrdersData={travelOrders || []}
      isAssignedToProgram={isAssignedToProgram}
    />
  );
}

// Export for view mode
export function PostTravelForm({
  data,
}: {
  data: PostTravelWithDetails | null;
}) {
  return <CreatePostTravelForm isAddMode={false} values={data ?? undefined} />;
}
