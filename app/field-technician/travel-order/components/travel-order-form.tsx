"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { TravelOrderProjectsType, TravelOrderType } from "@/components/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import FormInput from "@/components/custom/input/form-input";
import FormSelect from "@/components/custom/select/form-select";
import NonFormInput from "@/components/custom/input/non-form-input";
import * as z from "zod";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import ItineraryOfTravel from "@/app/dashboard/programs/[programID]/travel-order/components/itinerary-of-travel";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { InsertTravelOrderAction } from "@/app/actions/TravelOrderAction";
import { toast } from "sonner";
import { CustomTabList } from "@/components/custom/layout/custom-tab-list";
import { useSupabaseSession } from "@/hooks/use-session";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllAssignedProjectsByFieldTechnicianIDAction } from "@/app/actions/AssignedProjectAction";
import { SelectAllProgramsAction } from "@/app/actions/ProgramAction";
import { useSelectUserProfileHook } from "@/app/hooks/UserProfileHook";
import AssignedProgramDropdown from "@/components/custom/dropdown/assigned-program-dropdown";

const formSchema = z
  .object({
    travel_order_no: z
      .string()
      .min(1, { message: "Travel order number is required" }),
    program_id: z.string().optional(),
    user_id: z.string().min(1, { message: "User is required" }),
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
  const { openModal, closeModal } = useModal();
  const { closeSheet } = useSheet();
  const { data: userData } = useSupabaseSession();
  const { data: userProfile } = useSelectUserProfileHook();

  const form = useForm<TravelOrderSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travel_order_no: values?.travel_order_no || "",
      program_id: values?.program_id || "",
      user_id: values?.user_id || userData?.user.id || "",
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

  // Auto-fill user_id when user data is available
  useEffect(() => {
    if (isAddMode && userData?.user.id && !form.getValues("user_id")) {
      form.setValue("user_id", userData.user.id);
    }
  }, [userData, isAddMode, form]);

  const modeOfTransportOptions = [
    { value: "da_rfo_02_mv", label: "DA RFO 02 MV" },
    { value: "puv", label: "PUV" },
    { value: "private", label: "Private" },
    { value: "plane", label: "Plane" },
  ];

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: TravelOrderSchema) =>
      await InsertTravelOrderAction(data),
    invalidateKeys: ["travel_order"],
    onSuccess: () => {
      toast.success("Travel order created successfully.");
      closeSheet();
    },
    onError: () => {
      toast.error("Failed to create travel order. Please try again.");
    },
  });

  const onSubmit = (data: TravelOrderSchema) => {
    // Ensure itinerary has at least one entry
    if (!data.travel_itinerary || data.travel_itinerary.length === 0) {
      toast.error("At least one itinerary entry is required.");
      return;
    }

    mutate(data);
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
                    <>
                      <NonFormInput
                        label="Issued To:"
                        defaultValue={userProfile?.fullname || "You"}
                        readOnly
                      />
                      <AssignedProgramDropdown
                        onChange={(program) =>
                          form.setValue("program_id", program)
                        }
                      />
                    </>
                  ) : (
                    <>
                      <NonFormInput
                        label="Issued To:"
                        defaultValue={values?.user?.fullname}
                        readOnly={!isAddMode}
                      />
                      {values?.program_id && (
                        <NonFormInput
                          label="Program:"
                          defaultValue={values?.programs?.program_name}
                          readOnly
                        />
                      )}
                    </>
                  )}
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
      <CustomSheetFooter isPending={isPending}>
        {isAddMode && (
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
        )}
      </CustomSheetFooter>
    </form>
  );
}
