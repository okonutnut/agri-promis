"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { UserComboBox } from "./user-combobox";
import { TravelOrderProjectsType, TravelOrderType } from "@/components/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useParams } from "next/navigation";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import FormInput from "@/components/custom/input/form-input";
import FormSelect from "@/components/custom/select/form-select";
import NonFormInput from "@/components/custom/input/non-form-input";
import * as z from "zod";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import ItineraryOfTravel from "./itinerary-of-travel";
import { Label } from "@/components/ui/label";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { InsertTravelOrderAction } from "@/app/actions/TravelOrderAction";
import { toast } from "sonner";

const formSchema = z
  .object({
    travel_order_no: z
      .string()
      .min(1, { message: "Travel order number is required" }),
    program_id: z.string().min(1, { message: "Program ID is required" }),
    user_id: z.string().min(1, { message: "User is required" }),
    /* office: z.string().min(1, { message: "Office is required" }),
    fund: z.coerce
      .number()
      .min(0, { message: "Fund must be a positive number" }),
    estimated_cost: z.coerce
      .number()
      .min(0, { message: "Cost must be a positive number" }), */
    departure_date: z
      .string()
      .min(1, { message: "Departure date is required" }),
    return_date: z.string().min(1, { message: "Return date is required" }),
    mode_of_transport: z.enum(["da_rfo_02_mv", "puv", "private", "plane"], {
      required_error: "Mode of transportation is required",
    }),
    travel_itinerary: z
      .array(
        z.object({
          date: z.string().optional(),
          destination: z.string().optional(),
          purpose: z.string().optional(),
          departure_time: z.string().optional(),
          arrival_time: z.string().optional(),
        })
      )
      .min(1, { message: "At least one itinerary is required" }),
  })
  .refine(
    (data) =>
      !data.departure_date ||
      new Date(data.return_date) >= new Date(data.departure_date),
    {
      message: "Return date must be after departure date",
      path: ["return_date"],
    }
  );

type TravelOrderSchema = z.infer<typeof formSchema>;

type IssueTravelOrderFormProps = {
  isAddMode?: boolean;
  values?: TravelOrderType | null;
};

export default function IssueTravelOrderForm({
  isAddMode,
  values,
}: IssueTravelOrderFormProps) {
  const { programID } = useParams();
  const { openModal, closeModal } = useModal();
  const { closeSheet } = useSheet();

  const form = useForm<TravelOrderSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travel_order_no: values?.travel_order_no || "",
      program_id: programID as string,
      user_id: values?.user_id || "",
      // office: values?.office || "DA NVES",
      // fund: values?.fund || 0,
      // estimated_cost: values?.estimated_cost || 0,
      departure_date: values?.departure_date || "",
      return_date: values?.return_date || "",
      mode_of_transport:
        (values?.mode_of_transport as
          | "da_rfo_02_mv"
          | "puv"
          | "private"
          | "plane") || "da_rfo_02_mv",
      travel_itinerary: values?.travel_itinerary || [],
    },
  });

  const modeOfTransportOptions = [
    { value: "da_rfo_02_mv", label: "DA RFO 02 MV" },
    { value: "puv", label: "PUV" },
    { value: "private", label: "Private" },
    { value: "plane", label: "Plane" },
  ];

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: TravelOrderSchema) =>
      await InsertTravelOrderAction(data),
    invalidateKeys: ["travel_order", programID as string],
  });

  const onSubmit = (data: TravelOrderSchema) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Travel order inserted successfully.");
        closeSheet();
      },
      onError: () => {
        toast.error("Failed to insert travel order. Please try again.");
      },
    });
  };

  const [itinerary, setItinerary] = useState<TravelOrderProjectsType[]>(
    values?.travel_itinerary || []
  );

  // Sync itinerary state with form value
  useEffect(() => {
    form.setValue("travel_itinerary", itinerary);
  }, [itinerary, form]);

  return (
    <>
      <form
        className="space-y-4 overflow-y-scroll p-2 pb-12 h-[calc(90vh)]"
        id="travel-order-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Label className="mb-4 text-md uppercase">Travel Order Info</Label>
        <FormInput
          label="Travel Order No:"
          name="travel_order_no"
          form={form}
          readOnly={!isAddMode}
        />
        {isAddMode ? (
          <UserComboBox form={form} />
        ) : (
          <NonFormInput
            label="Issued To:"
            defaultValue={values?.user?.fullname}
            readOnly={!isAddMode}
          />
        )}
        {/* <FormInput
          label="Office"
          name="office"
          form={form}
          readOnly={!isAddMode}
        />
        <FormInput
          label="Fund"
          name="fund"
          type="number"
          form={form}
          readOnly={!isAddMode}
        />
        <FormInput
          label="Estimated Cost"
          name="estimated_cost"
          type="number"
          form={form}
          readOnly={!isAddMode}
        /> */}
        <FormInput
          label="Date of Departure:"
          type="datetime-local"
          name="departure_date"
          form={form}
          readOnly={!isAddMode}
        />
        <FormInput
          label="Date of Return:"
          type="datetime-local"
          name="return_date"
          form={form}
          readOnly={!isAddMode}
        />
        {isAddMode ? (
          <FormSelect
            options={modeOfTransportOptions}
            label="Mode of Transportation:"
            name="mode_of_transport"
            form={form}
          />
        ) : (
          <NonFormInput
            label="Mode of Transportation:"
            defaultValue={values?.mode_of_transport?.toUpperCase()}
            readOnly
          />
        )}
        <ItineraryOfTravel
          isAddMode={isAddMode}
          itinerary={itinerary}
          setItinerary={setItinerary}
          isPending={isPending}
        />
      </form>
      <CustomSheetFooter isPending={isPending}>
        {isAddMode && (
          <Button
            variant={isPending ? "ghost" : "default"}
            disabled={isPending}
            size={"sm"}
            onClick={() => {
              openModal(
                "Attention!!!",
                "Are you sure you want to submit?",
                <Button
                  className="w-full"
                  onClick={() => {
                    form.handleSubmit(onSubmit)();
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
                <Send /> Submit
              </>
            )}
          </Button>
        )}
      </CustomSheetFooter>
    </>
  );
}
