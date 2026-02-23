"use client";

import { useParams } from "next/navigation";
import { MonitoringReportType } from "@/components/types";
import { deleteDraft } from "@/hooks/use-draft";
import { GenericReportForm } from "@/components/custom/forms/generic-report-form";
import SaveDraftButton from "../components/save-draft-button";
import DeleteDraftButton from "../components/delete-draft-button";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllTravelOrdersByUserIDAction } from "@/app/actions/TravelOrderAction";
import { CheckUserAssignedToProgramByProjectLocationAction } from "@/app/actions/AssignedProgramAction";
import { useSupabaseSession } from "@/hooks/use-session";
import { InsertMonitoringReportAction } from "@/app/actions/MonitoringAction";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";

type UploadFieldReportFormProps = {
  isAddMode?: boolean;
  isDraft?: boolean;
  values?: MonitoringReportType | null;
};

export default function UploadFieldReportForm({
  isAddMode,
  isDraft,
  values,
}: UploadFieldReportFormProps) {
  const { locationID } = useParams();
  const { data: userData } = useSupabaseSession();

  // Get travel orders to look up travel_order_no and date
  const { data: travelOrders } = useRealtimeQuery({
    queryKey: ["travel-orders"],
    queryFn: () => SelectAllTravelOrdersByUserIDAction(userData?.user.id),
    table: "travel_order",
  });

  // Check if user is assigned to the program
  const { data: isAssignedToProgram } = useRealtimeQuery({
    queryKey: ["user-program-assignment-form", locationID as string],
    queryFn: () =>
      CheckUserAssignedToProgramByProjectLocationAction(locationID as string),
    table: "assigned_fieldtechnicians",
  });

  return (
    <GenericReportForm
      type="monitoring"
      isAddMode={isAddMode}
      isDraft={isDraft}
      values={values}
      mutationFn={async (data: any) => InsertMonitoringReportAction(data)}
      invalidateKeys={["monitoring-report", locationID as string]}
      onSuccess={async () => {
        await deleteDraft(values?.key as string);
      }}
      showDrafts={true}
      draftKey={values?.key}
      SaveDraftComponent={SaveDraftButton}
      DeleteDraftComponent={DeleteDraftButton}
      enableImageCapture={true}
      locationID={
        Array.isArray(locationID) ? locationID[0] : (locationID as string)
      }
      travelOrdersData={travelOrders}
      isAssignedToProgram={isAssignedToProgram}
    />
  );
}
