"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { UserComboBox } from "./user-combobox";
import { TravelOrderProjectsType, TravelOrderType } from "@/components/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Pencil, Send, Trash, X } from "lucide-react";
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
import {
  CheckTravelOrderLinkedAction,
  InsertTravelOrderAction,
  UpdateTravelOrderAction,
} from "@/app/actions/TravelOrderAction";
import { toast } from "sonner";
import { CustomTabList } from "@/components/custom/layout/custom-tab-list";
import { SoftDeleteAction } from "@/app/actions/DeleteAction";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";

const formSchema = z
  .object({
    travel_order_no: z
      .string()
      .min(1, { message: "Travel order number is required" }),
    program_id: z.string().min(1, { message: "Program ID is required" }),
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
  isAddMode = false,
  values,
}: IssueTravelOrderFormProps) {
  const { programID } = useParams();
  const { openModal, closeModal } = useModal();
  const { closeSheet } = useSheet();

  const [isEditMode, setIsEditMode] = useState(false);

  const initialValues = useMemo<TravelOrderSchema>(
    () => ({
      travel_order_no: values?.travel_order_no || "",
      program_id: (programID as string) || "",
      user_id: values?.user_id || "",
      departure_date: values?.departure_date || "",
      return_date: values?.return_date || "",
      mode_of_transport:
        (values?.mode_of_transport as
          | "da_rfo_02_mv"
          | "puv"
          | "private"
          | "plane") || "da_rfo_02_mv",
      travel_itinerary: values?.travel_itinerary || [],
    }),
    [programID, values],
  );

  const form = useForm<TravelOrderSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const [itinerary, setItinerary] = useState<TravelOrderProjectsType[]>(
    values?.travel_itinerary || [],
  );

  useEffect(() => {
    form.setValue("travel_itinerary", itinerary, { shouldValidate: true });
  }, [itinerary, form]);

  useEffect(() => {
    form.reset(initialValues);
    setItinerary(initialValues.travel_itinerary || []);
    setIsEditMode(false);
  }, [form, initialValues]);

  const modeOfTransportOptions = [
    { value: "da_rfo_02_mv", label: "DA RFO 02 MV" },
    { value: "puv", label: "PUV" },
    { value: "private", label: "Private" },
    { value: "plane", label: "Plane" },
  ];

  const { data: linkStatus } = useQuery({
    queryKey: ["travel_order_linked", values?.id],
    queryFn: () => CheckTravelOrderLinkedAction(values!.id!),
    enabled: !isAddMode && !!values?.id,
  });

  const isLocked = linkStatus?.isLinked ?? false;

  const { mutate: insertTravelOrder, isPending: isInsertPending } =
    useUniversalMutation({
      mutationFn: async (data: TravelOrderSchema) =>
        await InsertTravelOrderAction(data),
      invalidateKeys: ["travel_order", programID as string],
    });

  const { mutate: updateTravelOrder, isPending: isUpdatePending } =
    useUniversalMutation({
      mutationFn: async (data: TravelOrderSchema) =>
        await UpdateTravelOrderAction(values!.id!, data),
      invalidateKeys: ["travel_order", programID as string],
      onSuccess: () => {
        toast.success("Travel order updated successfully.");
        setIsEditMode(false);
      },
      onError: () => {
        toast.error("Failed to update travel order. Please try again.");
      },
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

  const isPending = isInsertPending || isUpdatePending || isDeletePending;

  const onSubmitCreate = (data: TravelOrderSchema) => {
    if (!data.travel_itinerary || data.travel_itinerary.length === 0) {
      toast.error("At least one itinerary entry is required.");
      return;
    }

    insertTravelOrder(data, {
      onSuccess: () => {
        toast.success("Travel order inserted successfully.");
        closeSheet();
      },
      onError: () => {
        toast.error("Failed to insert travel order. Please try again.");
      },
    });
  };

  const onSubmitUpdate = (data: TravelOrderSchema) => {
    if (!data.travel_itinerary || data.travel_itinerary.length === 0) {
      toast.error("At least one itinerary entry is required.");
      return;
    }
    updateTravelOrder(data);
  };

  const onDelete = () => {
    if (!values?.id) return;
    deleteTravelOrder({
      table: "travel_order",
      recordId: values.id,
    });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    form.reset(initialValues);
    setItinerary(values?.travel_itinerary || []);
  };

  const openSubmitConfirmation = (onConfirm: () => void, title: string) => {
    form.trigger("travel_itinerary").then((isValid) => {
      if (!isValid || itinerary.length === 0) {
        toast.error("At least one itinerary entry is required.");
        return;
      }

      openModal(
        "Attention",
        title,
        <Button
          className="w-full"
          onClick={() => {
            onConfirm();
            closeModal();
          }}
        >
          Confirm
        </Button>,
      );
    });
  };

  const isReadOnlyMode = !isAddMode && !isEditMode;

  return (
    <form
      id="travel-order-form"
      onSubmit={form.handleSubmit(
        isAddMode
          ? onSubmitCreate
          : isEditMode
            ? onSubmitUpdate
            : onSubmitCreate,
      )}
      className="flex flex-col h-full"
    >
      {!isAddMode && isLocked && (
        <div className="mx-4 mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            This travel order is linked to a{" "}
            <strong>{linkStatus?.linkedTo.join(" and ")}</strong> and cannot be
            edited.
          </span>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <CustomTabList
          tabs={[
            {
              title: "Travel Order Info",
              content: (
                <div className="space-y-4 overflow-y-auto p-2 h-full">
                  <FormInput
                    label="Travel Order No:"
                    name="travel_order_no"
                    form={form}
                    readOnly={!isAddMode && !isEditMode}
                  />

                  {isAddMode ? (
                    <UserComboBox form={form} />
                  ) : (
                    <NonFormInput
                      label="Issued To:"
                      defaultValue={values?.user?.fullname}
                      readOnly
                    />
                  )}

                  <FormInput
                    label="Date of Departure:"
                    type="datetime-local"
                    name="departure_date"
                    form={form}
                    readOnly={!isAddMode && !isEditMode}
                  />

                  <FormInput
                    label="Date of Return:"
                    type="datetime-local"
                    name="return_date"
                    form={form}
                    readOnly={!isAddMode && !isEditMode}
                  />

                  {isAddMode || isEditMode ? (
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
                <div className="h-full p-2">
                  <ItineraryOfTravel
                    isAddMode={isAddMode}
                    isEditMode={isEditMode}
                    itinerary={itinerary}
                    setItineraryAction={setItinerary}
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
        {isAddMode ? (
          <Button
            variant={isInsertPending ? "ghost" : "default"}
            disabled={isInsertPending || itinerary.length === 0}
            size="sm"
            type="button"
            onClick={() =>
              openSubmitConfirmation(
                () => form.handleSubmit(onSubmitCreate)(),
                "You confirm that all information provided is correct.",
              )
            }
          >
            {isInsertPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Send /> Submit
              </>
            )}
          </Button>
        ) : isEditMode ? (
          <>
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={isUpdatePending}
              onClick={handleCancelEdit}
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>

            <Button
              variant={isUpdatePending ? "ghost" : "default"}
              disabled={isUpdatePending || itinerary.length === 0}
              size="sm"
              type="button"
              onClick={() =>
                openSubmitConfirmation(
                  () => form.handleSubmit(onSubmitUpdate)(),
                  "Are you sure you want to save these changes?",
                )
              }
            >
              {isUpdatePending ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                <>
                  <Send /> Save
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {!isLocked && (
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => setIsEditMode(true)}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}

            <Button
              variant={isDeletePending ? "ghost" : "outline"}
              disabled={isDeletePending || itinerary.length === 0}
              size="sm"
              type="button"
              onClick={() => {
                openModal(
                  "Attention",
                  "Are you sure you want to delete this travel order? This action cannot be undone.",
                  <Button
                    className="w-full"
                    variant="destructive"
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
          </>
        )}
      </CustomSheetFooter>

      {isReadOnlyMode && (
        <input
          type="hidden"
          value={values?.id || ""}
          aria-hidden="true"
          readOnly
        />
      )}
    </form>
  );
}
