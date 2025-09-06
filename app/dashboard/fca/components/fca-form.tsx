"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/custom/input/form-input";
import FormSelect from "@/components/custom/select/form-select";
import { Loader2, Send } from "lucide-react";
import { useEditFCAHook, useInsertFCAHook } from "@/app/hooks/FCAHook";
import { FCAType } from "@/components/types";
import { Label } from "@/components/ui/label";
import { SheetFooterSlot } from "@/components/custom/layout/custom-page-layout";

const formSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Name is required"),
  member_count: z.coerce.number().min(1, "Member count is required"),
  active_status: z.coerce.number().min(0, "Role is required"),
});

type FormType = z.infer<typeof formSchema>;

type FCAFormProps = {
  isAddMode: boolean;
  data: FCAType | null;
  setPanelOpen: () => void;
};
export function FCAForm({ isAddMode, data, setPanelOpen }: FCAFormProps) {
  const status = [
    { value: 0, label: "Inactive" },
    { value: 1, label: "Active" },
  ];

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || "",
      description: data?.description || "",
      member_count: data?.member_count || 0,
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
          setPanelOpen();
          form.reset();
        },
      });
    } else {
      updateMutate(data, {
        onSuccess: () => {
          setPanelOpen();
          form.reset();
        },
      });
    }
  };
  return (
    <>
      <Label className="px-3 my-2 text-xl">FCA Information</Label>
      <form
        className="p-3 space-y-4 mb-4 overflow-auto"
        id="fca-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          label="Farmer's Cooperative Association Name"
          name="description"
          form={form}
          noPlaceholder
        />
        <FormInput
          label="Total Member Count"
          name="member_count"
          type="number"
          form={form}
          noPlaceholder
        />
        {!isAddMode && (
          <FormSelect
            options={status.map((status) => ({
              value: status.value,
              label: status.label,
            }))}
            label="Active Status"
            name="active_status"
            form={form}
          />
        )}
      </form>
      <SheetFooterSlot>
        <Button
          type="submit"
          form="fca-form"
          size={"sm"}
          variant={isPending ? "ghost" : "default"}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Send /> Submit
            </>
          )}
        </Button>
      </SheetFooterSlot>
    </>
  );
}
