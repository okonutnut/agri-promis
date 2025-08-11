import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/custom/input/form-input";
import FormSelect from "@/components/custom/select/form-select";
import { Loader2 } from "lucide-react";
import { useInsertMemberHook } from "@/components/hooks";
import { UserProfileType } from "@/components/types";
import NonFormInput from "@/components/custom/input/non-form-input";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";

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
  role: z.string().min(1, "Role is required"),
});

type MemberType = z.infer<typeof formSchema>;

type TeamMemberFormProps = {
  isAddMode: boolean;
  data: UserProfileType | null;
  setPanelOpen: Dispatch<SetStateAction<boolean>>;
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
      role: data?.role ? String(data.role) : "1",
    },
  });

  const { mutate, isPending, isSuccess } = useInsertMemberHook();
  const onSubmit = (data: MemberType) =>
    mutate({ ...data, role: Number(data.role) });

  useEffect(() => {
    if (isSuccess) {
      setPanelOpen(false);
    }
  }, [isSuccess, setPanelOpen]);

  return (
    <>
      <form
        className="p-3 space-y-4"
        id="team-member-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          label="Fullname"
          name="fullname"
          form={form}
          readonly={!isAddMode}
        />
        <FormInput
          label="Email"
          name="email"
          form={form}
          type="email"
          readonly={!isAddMode}
        />
        <FormInput
          label="Position"
          name="position"
          form={form}
          readonly={!isAddMode}
        />
        {!data?.role ? (
          <FormSelect
            options={roles.map((role) => ({
              value: role.value.toString(),
              label: role.label,
            }))}
            label="Role"
            name="role"
            form={form}
          />
        ) : (
          <NonFormInput
            label="Role"
            defaultValue={
              data.role != null
                ? data.role.toString() === "1"
                  ? "System Admin"
                  : "System User"
                : "N/A"
            }
            readonly
          />
        )}
      </form>
      <SheetFooter className="border-t p-2">
        {!data && (
          <Button
            type="submit"
            form="team-member-form"
            variant={isPending ? "ghost" : "default"}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        )}
        <SheetClose asChild>
          <Button variant={"outline"}>Close</Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
}
