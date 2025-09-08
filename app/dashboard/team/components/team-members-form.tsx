"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/custom/input/form-input";
import FormSelect from "@/components/custom/select/form-select";
import { Loader2, Send } from "lucide-react";
import { useInsertMemberHook, useUpdateMemberHook } from "@/components/hooks";
import { UserProfileType } from "@/components/types";
import { Label } from "@/components/ui/label";
import { SheetFooterSlot } from "@/components/custom/layout/custom-page-layout";
import ChangeStatusButton from "./change-status-button";

const formSchema = z.object({
  id: z.string().optional(),
  fullname: z
    .string()
    .min(1, "Fullname is required")
    .refine((val) => /^[A-Za-z\s.]+$/.test(val), {
      message: "Fullname must only contain letters, spaces, and periods",
    }),
  email: z.string().email("Invalid email address"),
  position: z.string().min(1, "Position is required"),
  role: z.coerce.number().min(1, "Role is required"),
});

type MemberType = z.infer<typeof formSchema>;

type TeamMemberFormProps = {
  isAddMode: boolean;
  data: UserProfileType | null;
  setPanelOpen: (open: boolean) => void;
};
export function TeamMemberForm({
  isAddMode,
  data,
  setPanelOpen,
}: TeamMemberFormProps) {
  const roles = [
    { value: 1, label: "System Admin" },
    { value: 2, label: "System User" },
  ];

  const form = useForm<MemberType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || "",
      email: data?.email || "",
      fullname: data?.fullname || "",
      position: data?.position || "",
      role: data?.role || 1,
    },
  });

  // INSERT MEMBER HOOK
  const { mutate: insertMutate, isPending: isInsertPending } =
    useInsertMemberHook();
  // UPDATE MEMBER HOOK
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateMemberHook();

  const isPending = isInsertPending || isUpdatePending;

  const onSubmit = (data: MemberType) => {
    if (isAddMode) {
      insertMutate(data, {
        onSuccess: () => {
          form.reset();
          setPanelOpen(false);
        },
      });
    } else {
      updateMutate(data, {
        onSuccess: () => {
          form.reset();
          setPanelOpen(false);
        },
      });
    }
  };
  return (
    <>
      <Label className="px-3 my-2 text-xl">Account Info</Label>
      <form
        className="p-3 space-y-4 mb-4"
        id="team-member-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput label="Fullname" name="fullname" form={form} />
        <FormInput label="Email" name="email" form={form} type="email" />
        <FormInput label="Position" name="position" form={form} />
        <FormSelect
          options={roles.map((role) => ({
            value: role.value,
            label: role.label,
          }))}
          label="System Role"
          name="role"
          form={form}
        />
      </form>
      <SheetFooterSlot>
        {!isAddMode && <ChangeStatusButton data={data} form={form} />}
        <Button
          type="submit"
          form="team-member-form"
          size={"sm"}
          variant={isPending ? "ghost" : "default"}
          disabled={isPending}
        >
          {isInsertPending ? (
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
