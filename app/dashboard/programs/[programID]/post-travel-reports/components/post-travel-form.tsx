"use client";

import { PostTravelWithDetails } from "@/app/types";
import { useSheet } from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { ReviewPostTravelAction } from "@/app/actions/PostTravelAction";
import { toast } from "sonner";
import { useSupabaseSession } from "@/hooks/use-session";
import { GenericReportForm } from "@/components/custom/forms/generic-report-form";

type PostTravelFormProps = {
  data: PostTravelWithDetails;
};

export function PostTravelForm({ data }: PostTravelFormProps) {
  const { programID } = useParams();
  const { closeSheet } = useSheet();
  const { data: session } = useSupabaseSession();

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (postTravelID: string) =>
      ReviewPostTravelAction(postTravelID),
    invalidateKeys: ["post_travel_reports", programID as string],
  });

  const handleReview = (postTravelID: string) => {
    mutate(postTravelID, {
      onSuccess: () => {
        toast.success("Post-travel report submitted for review");
        closeSheet();
      },
      onError: () => {
        toast.error("Failed to submit post-travel report for review");
      },
    });
  };

  return (
    <GenericReportForm
      type="post-travel"
      isAddMode={false}
      isDraft={false}
      values={data}
      mutationFn={async () => {}}
      invalidateKeys={["post_travel_reports", programID as string]}
      onSuccess={async () => closeSheet()}
      onReview={handleReview}
      reviewButtonLabel="Review"
      reviewIsPending={isPending}
      showReviewButton={
        !data?.reviewer_id && session?.user.id !== data?.user_id
      }
    />
  );
}
