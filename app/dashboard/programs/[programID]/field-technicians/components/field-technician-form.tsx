import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "../types";
import { InsertFieldTechnicianHook } from "../hook";
import FormInput from "@/components/custom/input/form-input";

const formSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  fullname: z.string().min(1, "Fullname is required"),
});

type FieldTechType = z.infer<typeof formSchema>;

type FieldTechnicianFormProps = {
  data: UserProfile | null;
};
export function FieldTechnicianForm({ data }: FieldTechnicianFormProps) {
  const form = useForm<FieldTechType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || "",
      email: data?.email || "",
      fullname: data?.fullname || "",
    },
  });

  const { mutate, isPending } = InsertFieldTechnicianHook();
  const onSubmit = (data: FieldTechType) => mutate(data);

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
      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : data?.id ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
}
