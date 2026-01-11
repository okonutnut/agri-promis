"use client";

import { PostTravelReportType } from "@/components/types";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import NonFormInput from "@/components/custom/input/non-form-input";
import NonFormMultiInput from "@/components/custom/input/non-form-multi-input";
import NonFormTextarea from "@/components/custom/input/non-form-textarea";
import dynamic from "next/dynamic";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { ReviewPostTravelAction } from "@/app/actions/PostTravelAction";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";
import { useSupabaseSession } from "@/hooks/use-session";
const ImageCarousel = dynamic(
  () => import("@/components/custom/images/image-carousel"),
  { ssr: false }
);

type PostTravelFormProps = {
  data: PostTravelReportType;
};
export function PostTravelForm({ data }: PostTravelFormProps) {
  const { programID } = useParams();
  const { openModal, closeModal } = useModal();
  const { closeSheet } = useSheet();
  const { data: session } = useSupabaseSession();

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (postTravelID: string) =>
      ReviewPostTravelAction(postTravelID),
    invalidateKeys: ["post_travel_reports", programID as string],
  });

  const datesOfTravel = useMemo(() => {
    if (!data.travel_date) return "N/A";
    const start_date = format(new Date(data.travel_date.date!), "PP");
    const end_date = data.travel_date.end_date
      ? format(new Date(data.travel_date.end_date), "PP")
      : null;

    return `${start_date}${end_date ? ` - ${end_date}` : ""}`;
  }, [data.travel_date]);

  return (
    <>
      <section className="space-y-4 h-[calc(90vh)] overflow-y-auto overflow-x-hidden">
        <ImageCarousel images={data.photo_url || []} />
        <div className="p-2 space-y-4 border-t">
          <NonFormInput
            label="Reporter Name:"
            defaultValue={data.travel_order?.user?.fullname}
            readOnly
          />
          <NonFormInput
            label="Travel Order No:"
            defaultValue={data.travel_order?.travel_order_no}
            readOnly
          />
          <NonFormInput
            label="Inclusive Date of Travel:"
            defaultValue={datesOfTravel}
            readOnly
          />
          <NonFormInput
            label="Projects Places Visited:"
            defaultValue={data.projects_places_visited}
            readOnly
          />
          <NonFormInput
            label="Activities Undertaken:"
            defaultValue={data.activities_undertaken}
            readOnly
          />
          <NonFormMultiInput
            label="Issues / Concerns / Project % Accomplishment To Date:"
            values={
              Array.isArray(data.issues_concern) ? data.issues_concern : []
            }
          />
          <NonFormTextarea
            label="Remarks:"
            noPlaceholder={!!data}
            props={{ defaultValue: data?.remarks }}
            readOnly
          />
        </div>
      </section>
      <CustomSheetFooter isPending={isPending}>
        {(!data?.reviewer_id || session?.user.id === data?.user_id) && (
          <Button
            size={"sm"}
            variant={isPending ? "ghost" : "default"}
            onClick={() => {
              openModal(
                "Confirm Action",
                "Are you sure you want to submit for review?",
                <Button
                  className="w-full"
                  onClick={() => {
                    mutate(data.id as string, {
                      onSuccess: () => {
                        toast.success(
                          "Post-travel report submitted for review"
                        );
                        closeSheet();
                      },
                      onError: () => {
                        toast.error(
                          "Failed to submit post-travel report for review"
                        );
                      },
                    });
                    closeModal();
                  }}
                >
                  Confirm
                </Button>
              );
            }}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Send />
                Review
              </>
            )}
          </Button>
        )}
      </CustomSheetFooter>
    </>
  );
}
