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

const formSchema = z.object({
  id: z.string().optional(),
  fullname: z
    .string()
    .min(1, "Fullname is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "Fullname must only contain letters and spaces",
    }),
  email: z.string().email("Invalid email address"),
  role: z.enum(["field_technician", "agriculturist"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
});

type MemberType = z.infer<typeof formSchema>;

type TeamMemberFormProps = {
  data: UserProfileType | null;
  setPanelOpen: Dispatch<SetStateAction<boolean>>;
};
export function TeamMemberForm({ data, setPanelOpen }: TeamMemberFormProps) {
  const roles = [
    { value: "agriculturist", label: "Agriculturist" },
    { value: "field_technician", label: "Field Technician" },
  ];

  // Map role label to value, handle both label and value formats
  const getRoleValue = () => {
    if (!data?.role) return undefined;

    // First check if it's already a value format
    const directMatch = roles.find((role) => role.value === data.role);
    if (directMatch)
      return directMatch.value as "field_technician" | "agriculturist";

    // Then check if it's a label format
    const labelMatch = roles.find((role) => role.label === data.role);
    if (labelMatch)
      return labelMatch.value as "field_technician" | "agriculturist";

    return undefined;
  };

  const form = useForm<MemberType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || "",
      email: data?.email || "",
      fullname: data?.fullname || "",
      role: getRoleValue() || "agriculturist",
    },
  });

  const { mutate, isPending, isSuccess } = useInsertMemberHook();
  const onSubmit = (data: MemberType) => mutate(data);

  useEffect(() => {
    if (isSuccess) {
      setPanelOpen(false);
    }
  }, [isSuccess, setPanelOpen]);

  return (
    <form className="p-3 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {data?.id && <FormInput label="ID" name="id" form={form} readonly />}
      <FormInput label="Fullname" name="fullname" form={form} />
      <FormInput
        label="Email"
        name="email"
        form={form}
        type="email"
        readonly={data ? true : false}
      />
      {!data ? (
        <FormSelect options={roles} label="Role" name="role" form={form} />
      ) : (
        <NonFormInput label="Role" defaultValue={data?.role || ""} readonly />
      )}
      {!data && (
        <Button
          type="submit"
          className="absolute bottom-12 right-0 left-0 m-2"
          variant={isPending ? "ghost" : "default"}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Save"}
        </Button>
      )}
    </form>
  );
}
