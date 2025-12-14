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
const ImageCarousel = dynamic(
  () => import("@/components/custom/images/image-carousel"),
  { ssr: false }
);

type PostTravelFormProps = {
  data: PostTravelReportType | null;
};
export function PostTravelForm({ data }: PostTravelFormProps) {
  const { programID } = useParams();
  const { openModal, closeModal } = useModal();
  const { closeSheet } = useSheet();

  return (
    <>
      <section className="space-y-4 h-[calc(90vh)] overflow-y-auto overflow-x-hidden">
        {/* <ImageCarousel images={data?.photo_url || []} /> */}
        <div className="p-2 space-y-4 border-t">
          <NonFormInput
            label="Reporter Name:"
            defaultValue={data?.user?.fullname}
            readOnly
          />
          <NonFormInput
            label="Travel Order No:"
            defaultValue={data?.travel_order?.travel_order_no}
            readOnly
          />
          <NonFormInput
            label="Inclusive Date of Travel:"
            defaultValue={data?.travel_date?.date}
            readOnly
          />
          <NonFormInput
            label="Activities Undertaken:"
            defaultValue={data?.activities_undertaken}
            readOnly
          />
          <NonFormTextarea
            label="Projects Places Visited"
            defaultValue={data?.projects_places_visited}
            readOnly
          />
          <NonFormMultiInput
            label={"Issues / Concerns / Project % Accomplishment To Date:"}
            values={data?.issues_concern}
          />
          <NonFormTextarea
            label="Remarks"
            defaultValue={data?.remarks}
            noPlaceholder={!!data}
            readOnly
          />
        </div>
      </section>  
      <CustomSheetFooter />
        {/* {!data?.reviewer_id ? (
          <Button
            size={"sm"}
            disabled={isInsertPending}
            onClick={() => {
              insertMutate(data);
            }}
          >
            {isInsertPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Send />
                Submit for Review
              </>
            )}
          </Button>
        ) : (
          <PrintDownloadDropdown
            data={<PostTravelDocument data={data} />}
            values={data as PostTravelReportType}
          /> 
          null
        )} */}
      {/* </CustomSheetFooter> */}
    </>
  );
}
