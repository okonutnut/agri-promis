"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "@/components/custom/select/form-select";
import { Loader2, Send } from "lucide-react";
import { useUpdateMemberHook } from "@/components/hooks";
import { UserProfileType } from "@/components/types";
import { Label } from "@/components/ui/label";
import ChangeStatusButton from "./change-status-button";
import { useMemo, useState } from "react";
import { useSupabaseSession } from "@/hooks/use-session";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import {
  useModal,
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { InsertMemberAction } from "@/app/actions/MemberAction";
import FormInput from "@/components/custom/input/form-input";
import dynamic from "next/dynamic";
const FTGPSCard = dynamic(
  () =>
    import("../../project-location/[locationID]/field-technicians/components/gps/gps-card"),
  { ssr: false },
);

const formSchema = z.object({
  id: z.string().optional(),
  fullname: z
    .string()
    .min(1, "Fullname is required")
    .refine((val) => /^[A-Za-z\s.]+$/.test(val), {
      message: "Fullname must only contain letters, spaces, and periods",
    }),
  email: z
    .string()
    .email("Invalid email address")
    .refine((val) => val === val.toLowerCase(), {
      message: "Email must be in lowercase",
    }),
  position: z.string().min(1, "Position is required"),
  role: z.coerce.number().min(1, "Role is required"),
});
type TeamMemberType = z.infer<typeof formSchema>;

type TeamMemberFormProps = {
  isAddMode: boolean;
  data: UserProfileType | null;
};
export function TeamMemberForm({ isAddMode, data }: TeamMemberFormProps) {
  const { openModal, closeModal } = useModal();
  const { closeSheet } = useSheet();
  const [pageState, setPageState] = useState<"idle" | "loading">("idle");

  const roles = [
    { value: 1, label: "System Admin" },
    { value: 2, label: "System User" },
  ];

  const form = useForm<TeamMemberType>({
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
  // const { mutate: insertMutate, isPending: isInsertPending } =
  //   useInsertMemberHook();
  const { mutate: insertMutate, isPending: isInsertPending } =
    useUniversalMutation({
      mutationFn: async (data: TeamMemberType) =>
        await InsertMemberAction(data),
      invalidateKeys: ["team-members"],
    });

  // UPDATE MEMBER HOOK
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateMemberHook();

  // CURRENT USER SESSION
  const { data: userData } = useSupabaseSession();
  const isUserProfileOrAdmin = useMemo(() => {
    return (
      userData?.user.id == data?.id || userData?.user.user_metadata?.role === 1
    );
  }, [data, userData?.user.id, userData?.user.user_metadata?.role]);

  const isPending = isInsertPending || isUpdatePending;

  const onSubmit = (data: TeamMemberType) => {
    setPageState("loading");
    if (isAddMode) {
      insertMutate(data, {
        onSuccess: () => {
          form.reset();
          setPageState("idle");
          closeSheet();
        },
      });
    } else {
      updateMutate(data, {
        onSuccess: () => {
          form.reset();
          setPageState("idle");
          closeSheet();
        },
      });
    }
  };

  return (
    <>
      {!isAddMode && <FTGPSCard user_id={data?.id || ""} />}
      <Label className="px-3 my-2 text-xl">Account Info</Label>
      <form
        className="p-3 space-y-4 mb-4"
        id="team-member-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          form={form}
          name="fullname"
          label="Fullname"
          readOnly={!isAddMode && !isUserProfileOrAdmin}
        />
        <FormInput form={form} name="email" label="Email" readOnly={true} />
        <FormInput
          form={form}
          name="position"
          label="Position"
          readOnly={!isAddMode && !isUserProfileOrAdmin}
        />
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
      <CustomSheetFooter isPending={isPending || pageState === "loading"}>
        {!isAddMode && !isUserProfileOrAdmin && (
          <ChangeStatusButton
            pageState={pageState}
            setPageState={setPageState}
            data={data}
            form={form}
          />
        )}
        <Button
          size={"sm"}
          onClick={() =>
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
            )
          }
          variant={isPending ? "ghost" : "default"}
          disabled={
            isPending || pageState == "loading" || !form.formState.isValid
          }
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
