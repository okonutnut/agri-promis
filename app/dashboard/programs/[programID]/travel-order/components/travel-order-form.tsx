"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { UserComboBox } from "./user-combobox";
import { TravelOrderProjectsType, TravelOrderType } from "@/components/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, Trash } from "lucide-react";
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
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { InsertTravelOrderAction } from "@/app/actions/TravelOrderAction";
import { toast } from "sonner";
import { CustomTabList } from "@/components/custom/layout/custom-tab-list";
import { SoftDeleteAction } from "@/app/actions/DeleteAction";
import { Spinner } from "@/components/ui/spinner";

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
        }),
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
    },
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

  const { mutate: deleteTravelOrder, isPending: isDeletePending } =
    useUniversalMutation({
      mutationFn: async (data: { table: string; recordId: string }) =>
        await SoftDeleteAction({
          tableName: data.table,
          recordId: data.recordId,
        }),
      invalidateKeys: ["travel_order", programID as string],
      onSuccess: () => {
        toast.success("Travel order deleted successfully.");
        closeSheet();
      },
      onError: () => {
        toast.error("Failed to delete travel order. Please try again.");
      },
    });

  const onSubmit = (data: TravelOrderSchema) => {
    if (!data.travel_itinerary || data.travel_itinerary.length === 0) {
      toast.error("At least one itinerary entry is required.");
      return;
    }

    mutate(data, {
      onSuccess: async () => {
        toast.success("Travel order inserted successfully.");
        closeSheet();
      },
      onError: () => {
        toast.error("Failed to insert travel order. Please try again.");
      },
    });
  };

  const onDelete = () => {
    deleteTravelOrder({
      table: "travel_order",
      recordId: values?.id || "",
    });
  };

  const [itinerary, setItinerary] = useState<TravelOrderProjectsType[]>(
    values?.travel_itinerary || [],
  );

  // Sync itinerary state with form value and trigger validation
  useEffect(() => {
    form.setValue("travel_itinerary", itinerary, { shouldValidate: true });
  }, [itinerary, form]);

  return (
    <form
      id="travel-order-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col h-full"
    >
      <div className="flex-1 min-h-0">
        <CustomTabList
          tabs={[
            {
              title: "Travel Order Info",
              content: (
                <div className="space-y-4 overflow-y-auto p-4 h-full">
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
                </div>
              ),
            },
            {
              title: "Itinerary of Travel",
              content: (
                <div className="h-full p-4">
                  <ItineraryOfTravel
                    isAddMode={isAddMode}
                    itinerary={itinerary}
                    setItinerary={setItinerary}
                    isPending={isPending}
                    departureDate={form.watch("departure_date")}
                    returnDate={form.watch("return_date")}
                  />
                  {form.formState.errors.travel_itinerary && (
                    <p className="text-xs text-red-500 mt-2">
                      {form.formState.errors.travel_itinerary.message}
                    </p>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
      <CustomSheetFooter isPending={isPending || isDeletePending}>
        {isAddMode ? (
          <>

            <Button
              variant={isPending ? "ghost" : "default"}
              disabled={isPending || itinerary.length === 0}
              size={"sm"}
              type="button"
              onClick={() => {
                // Validate form before opening modal
                form.trigger("travel_itinerary").then((isValid) => {
                  if (!isValid) {
                    toast.error("At least one itinerary entry is required.");
                    return;
                  }

                  // Check itinerary length as well
                  if (itinerary.length === 0) {
                    toast.error("At least one itinerary entry is required.");
                    return;
                  }

                  openModal(
                    "Attention",
                    "You confirm that all information provided is correct.",
                    <Button
                      className="w-full"
                      onClick={() => {
                        form.handleSubmit(onSubmit)();
                        closeModal();
                      }}
                    >
                      Confirm
                    </Button>,
                  );
                });
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
          </>
        ) : (
          <Button
            variant={isDeletePending ? "ghost" : "outline"}
            disabled={isDeletePending || itinerary.length === 0}
            size={"sm"}
            type="button"
            onClick={() => {
              openModal(
                "Attention",
                "Are you sure you want to delete this travel order? This action cannot be undone.",
                <Button
                  className="w-full"
                  variant={"destructive"}
                  onClick={() => {
                    onDelete();
                    closeModal();
                  }}
                >
                  Confirm
                </Button>,
              );
            }}
          >
            {isDeletePending ? (
              <>
                <Spinner /> Deleting...
              </>
            ) : (
              <>
                <Trash className="text-red-500 mr-2" /> Delete
              </>
            )}
          </Button>
        )}
      </CustomSheetFooter>
    </form>
  );
}
