import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "../types";
import { InsertFieldTechnicianHook } from "../hook";

const formSchema = z.object({
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
      email: data?.email || "",
      fullname: data?.fullname || "",
    },
  });

  const { mutate, isPending } = InsertFieldTechnicianHook();
  const onSubmit = (data: FieldTechType) => mutate(data);

  return (
    <form className="p-3 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {data?.id && (
        <div>
          <label className="text-sm font-medium text">ID</label>
          <Input defaultValue={data.id} readOnly />
        </div>
      )}
      <div>
        <label className="text-sm font-medium text">Fullname</label>
        <Input
          {...form.register("fullname")}
          type="text"
          placeholder="Enter fullname"
        />
      </div>
      <div>
        <label className="text-sm font-medium text">Email</label>
        <Input
          {...form.register("email")}
          type="email"
          placeholder="Enter email"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : data?.id ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
}
