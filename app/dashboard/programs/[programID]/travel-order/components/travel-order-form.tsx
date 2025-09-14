"use client";

import FormInput from "@/components/custom/input/form-input";
import FormTextarea from "@/components/custom/input/form-textarea";
import FormSelect from "@/components/custom/select/form-select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { UserComboBox } from "./user-combobox";
import { ProjectDropdown } from "./project-combobox";
import NonFormInput from "@/components/custom/input/non-form-input";
import { TravelOrderType } from "@/components/types";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useInsertTravelOrderHook } from "@/components/hooks";
import { Loader2, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useModal } from "@/components/custom/layout/custom-page-layout";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";

const formSchema = z
  .object({
    travel_order_no: z
      .string()
      .min(1, { message: "Travel order number is required" })
      .regex(/^\d+-\d+$/, {
        message: "Must be numbers separated by a single dash",
      }),
    purpose: z.string().min(1, { message: "Purpose is required" }),
    user_id: z.string().min(1, { message: "User is required" }),
    office: z.string().min(1, { message: "Office is required" }),
    project_id: z.string().min(1, { message: "Project is required" }),
    fund: z.coerce
      .number()
      .min(0, { message: "Fund must be a positive number" }),
    estimated_cost: z.coerce
      .number()
      .min(0, { message: "Cost must be a positive number" }),
    departure_date: z
      .string()
      .min(1, { message: "Departure date is required" }),
    return_date: z.string().min(1, { message: "Return date is required" }),
    destination: z.string().min(1, { message: "Destination is required" }),
    mode_of_transport: z.enum(["da_rfo_02_mv", "puv", "private", "plane"], {
      required_error: "Mode of transportation is required",
    }),
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
  setPanelOpen?: () => void;
};

export default function IssueTravelOrderForm({
  isAddMode,
  values,
  setPanelOpen,
}: IssueTravelOrderFormProps) {
  const { programID } = useParams();
  const { openModal, closeModal } = useModal();

  const form = useForm<TravelOrderSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travel_order_no: values?.travel_order_no || "",
      user_id: values?.user_id || "",
      purpose: values?.purpose || "",
      office: values?.office || "DA NVES",
      project_id: values?.project_id || "",
      fund: values?.fund || 0,
      estimated_cost: values?.estimated_cost || 0,
      departure_date: values?.departure_date || "",
      return_date: values?.return_date || "",
      destination: values?.destination || "",
      mode_of_transport:
        (values?.mode_of_transport as
          | "da_rfo_02_mv"
          | "puv"
          | "private"
          | "plane") || "da_rfo_02_mv",
    },
  });

  const modeOfTransportOptions = [
    { value: "da_rfo_02_mv", label: "DA RFO 02 MV" },
    { value: "puv", label: "PUV" },
    { value: "private", label: "Private" },
    { value: "plane", label: "Plane" },
  ];

  const { mutate, isPending } = useInsertTravelOrderHook();
  const onSubmit = (data: TravelOrderSchema) => {
    mutate(
      { ...data, program_id: programID as string },
      {
        onSuccess: () => {
          if (setPanelOpen) setPanelOpen();
        },
      }
    );
  };

  return (
    <>
      <form
        className="space-y-4 overflow-y-scroll p-2 h-[calc(90vh)]"
        id="travel-order-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          label="Travel Order No."
          name="travel_order_no"
          form={form}
          readonly={!isAddMode}
        />
        <FormInput
          label="Purpose"
          name="purpose"
          form={form}
          readonly={!isAddMode}
        />
        {isAddMode ? (
          <UserComboBox form={form} />
        ) : (
          <NonFormInput
            label="Issued To"
            defaultValue={values?.user?.fullname}
            readonly={!isAddMode}
          />
        )}
        <FormInput
          label="Office"
          name="office"
          form={form}
          readonly={!isAddMode}
        />
        {isAddMode ? (
          <ProjectDropdown form={form} />
        ) : (
          <NonFormInput
            label="Project"
            defaultValue={values?.project?.project_name}
            readonly={!isAddMode}
          />
        )}
        <FormInput
          label="Fund"
          name="fund"
          type="number"
          form={form}
          readonly={!isAddMode}
        />
        <FormInput
          label="Estimated Cost"
          name="estimated_cost"
          type="number"
          form={form}
          readonly={!isAddMode}
        />
        <FormInput
          label="Departure Date"
          type="datetime-local"
          name="departure_date"
          form={form}
          readonly={!isAddMode}
        />
        <FormInput
          label="Return Date"
          type="datetime-local"
          name="return_date"
          form={form}
          readonly={!isAddMode}
        />
        <FormTextarea
          label="Destination"
          name="destination"
          form={form}
          readonly={!isAddMode}
        />
        {isAddMode ? (
          <FormSelect
            options={modeOfTransportOptions}
            label="Mode of Transportation"
            name="mode_of_transport"
            form={form}
          />
        ) : (
          <NonFormInput
            label="Mode of Transportation"
            defaultValue={values?.mode_of_transport?.toUpperCase()}
            readonly
          />
        )}
      </form>
      <CustomSheetFooter>
        {isAddMode && (
          <Button
            variant={isPending ? "ghost" : "default"}
            disabled={isPending || !form.formState.isValid}
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
