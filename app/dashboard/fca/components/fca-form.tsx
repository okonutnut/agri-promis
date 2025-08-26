"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/custom/input/form-input";
import FormSelect from "@/components/custom/select/form-select";
import { Loader2, Send } from "lucide-react";
import { useEditFCAHook, useInsertFCAHook } from "@/components/hooks";
import { FCAType } from "@/components/types";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import FCAPanel from "./fca-panel";

const formSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Name is required"),
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
      <Label className="ms-3">FCA Info</Label>
      <form
        className="p-3 space-y-4 overflow-auto border-b"
        id="fca-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          label="Farmer's Cooperative Association Name"
          name="description"
          form={form}
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
      <FCAPanel fcaID={data?.id as string} />
      <SheetFooter className="border-t p-2 flex-row justify-end gap-2">
        <SheetClose asChild>
          <Button variant={"outline"} size={"sm"} disabled={isPending}>
            Close
          </Button>
        </SheetClose>
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
      </SheetFooter>
    </>
  );
}
