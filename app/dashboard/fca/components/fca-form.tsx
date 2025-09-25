"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/custom/input/form-input";
import { Loader2, Send } from "lucide-react";
import { useEditFCAHook, useInsertFCAHook } from "@/app/hooks/FCAHook";
import { FCAType } from "@/components/types";
import { Label } from "@/components/ui/label";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import FCAActiveStatusButton from "./active-status-button";
import { useState } from "react";

const formSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "FCA Name is required"),
  president_name: z.string().min(1, "President Name is required"),
  contact_number: z
    .string()
    .regex(/^(\+63|0)\d{10}$/, "Contact Number must be a valid PH number"),
  member_count: z.coerce.number().min(1, "Member count is required"),
  active_status: z.coerce.number().min(0, "Role is required"),
});

type FormType = z.infer<typeof formSchema>;

type FCAFormProps = {
  isAddMode: boolean;
  data: FCAType | null;
};
export function FCAForm({ isAddMode, data }: FCAFormProps) {
  const [pageState, setPageState] = useState<"idle" | "loading">("idle");
  const { openModal, closeModal } = useModal();
  const { closeSheet } = useSheet();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || "",
      description: data?.description || "",
      member_count: data?.member_count || 0,
      president_name: data?.president_name || "",
      contact_number: data?.contact_number || "N/A",
      active_status: data?.active_status || 0,
    },
  });

  // INSERT
  const { mutate: insertMutate, isPending: isInsertPending } =
    useInsertFCAHook();
  // UPDATE
  const { mutate: updateMutate, isPending: isUpdatePending } = useEditFCAHook();

  const isPending = isInsertPending || isUpdatePending;

  const onSubmit = (data: FormType) => {
    if (isAddMode) {
      insertMutate(data, {
        onSuccess: () => {
          closeSheet();
          form.reset();
        },
      });
    } else {
      updateMutate(data, {
        onSuccess: () => {
          closeSheet();
          form.reset();
        },
      });
    }
  };

  const handleOpenModal = () => {
    openModal(
      "Attention!!!",
      "Are you sure you want to submit this form?",
      <Button
        className="w-full"
        onClick={() => {
          setPageState("loading");
          form.handleSubmit(onSubmit)();
          closeModal();
        }}
      >
        Confirm
      </Button>
    );
  };

  return (
    <>
      <Label className="px-3 my-2 text-xl">FCA Information</Label>
      <form
        className="p-3 space-y-4"
        id="fca-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          label="Farmer's Cooperative Association Name"
          name="description"
          form={form}
          noPlaceholder
        />
        {/* <FormInput
          label="President Name"
          name="president_name"
          form={form}
          noPlaceholder
        />
        <FormInput
          label="Contact Number"
          name="contact_number"
          type="number"
          form={form}
          noPlaceholder
        /> */}
        <FormInput
          label="Total Member Count"
          name="member_count"
          type="number"
          form={form}
          noPlaceholder
        />
      </form>
      <CustomSheetFooter isPending={isPending || pageState === "loading"}>
        {!isAddMode && (
          <FCAActiveStatusButton
            pageState={pageState}
            setPageState={setPageState}
            fcaID={data?.id as string}
            status={data?.active_status as number}
          />
        )}
        <Button
          variant={isPending ? "ghost" : "default"}
          size="sm"
          onClick={handleOpenModal}
          disabled={isPending || pageState === "loading"}
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Send /> Submit
            </>
          )}
        </Button>
      </CustomSheetFooter>
    </>
  );
}
