import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/custom/input/form-input";
import FormSelect from "@/components/custom/select/form-select";
import { Loader2 } from "lucide-react";
import { useInsertMemberHook } from "@/components/hooks";
import { UserProfile } from "@/components/types";
import NonFormInput from "@/components/custom/input/non-form-input";

const formSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  fullname: z.string().min(1, "Fullname is required"),
  role: z.enum(["field_technician", "agriculturist"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
});

type MemberType = z.infer<typeof formSchema>;

type TeamMemberFormProps = {
  data: UserProfile | null;
};
export function TeamMemberForm({ data }: TeamMemberFormProps) {
  const roles = [
    { value: "field_technician", label: "Field Technician" },
    { value: "agriculturist", label: "Agriculturist" },
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

  const { mutate, isPending } = useInsertMemberHook();
  const onSubmit = (data: MemberType) => mutate(data);

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
        <NonFormInput label="Role" defaultValue={data?.role || ""} />
      )}
      <div className="flex gap-2 justify-end">
        {!data && (
          <Button
            type="submit"
            variant={isPending ? "ghost" : "default"}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        )}
      </div>
    </form>
  );
}
