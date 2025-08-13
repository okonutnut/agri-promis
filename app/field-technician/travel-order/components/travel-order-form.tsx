"use client";

import { Button } from "@/components/ui/button";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import NonFormInput from "@/components/custom/input/non-form-input";
import { TravelOrderType } from "@/components/types";
import NonFormTextarea from "@/components/custom/input/non-form-textarea";
import { format } from "date-fns";

type IssueTravelOrderFormProps = {
  values?: TravelOrderType | null;
};

export default function IssueTravelOrderForm({
  values,
}: IssueTravelOrderFormProps) {
  return (
    <>
      <section
        className="space-y-4 p-2 overflow-y-auto h-[calc(100vh)]"
        id="travel-order-form"
      >
        <NonFormInput
          label="Travel Order No."
          defaultValue={values?.travel_order_no || "N/A"}
          readonly
        />
        <NonFormInput label="Purpose" defaultValue={values?.purpose} readonly />
        <NonFormInput
          label="Issued To"
          defaultValue={values?.user?.fullname}
          readonly
        />
        <NonFormInput label="Office" defaultValue={values?.office} readonly />
        <NonFormInput
          label="Project"
          defaultValue={values?.project?.project_name}
          readonly
        />
        <NonFormInput
          label="Fund"
          defaultValue={values?.fund?.toString() || "N/A"}
          readonly
        />
        <NonFormInput
          label="Estimated Cost"
          defaultValue={values?.estimated_cost?.toString() || "N/A"}
          readonly
        />
        <NonFormInput
          label="Departure Date"
          defaultValue={
            values?.departure_date
              ? format(new Date(values.departure_date.toString()), "PPp")
              : "N/A"
          }
          readonly
        />
        <NonFormInput
          label="Return Date"
          defaultValue={
            values?.return_date
              ? format(new Date(values.return_date.toString()), "PPp")
              : "N/A"
          }
          readonly
        />
        <NonFormTextarea
          label="Destination"
          defaultValue={values?.destination}
          readonly
        />
        <NonFormInput
          label="Mode of Transportation"
          defaultValue={values?.mode_of_transport?.toUpperCase()}
          readonly
        />
      </section>
      <SheetFooter className="border-t flex-row justify-end p-2">
        <SheetClose asChild>
          <Button variant={"outline"} size={"sm"}>
            Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
}
