import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InsertFieldTechnician } from "../actions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserProfile } from "../types";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullname: z.string().min(1, "Fullname is required"),
});

export type FTType = z.infer<typeof formSchema>;

type FieldTechnicianFormProps = {
  data: UserProfile | null;
};
export function FieldTechnicianForm({ data }: FieldTechnicianFormProps) {
  const form = useForm<FTType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: data?.email || "",
      fullname: data?.fullname || "",
    },
  });

  const mutation = useMutation({
    mutationFn: InsertFieldTechnician,
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || "Failed to add field technician", {
          position: "bottom-right",
        });
        return;
      }
      toast.success("Field technician added successfully", {
        position: "bottom-right",
      });
    },
    onError: () => {
      toast.error("Failed to add field technician", {
        position: "bottom-right",
      });
    },
  });
  const onSubmit = (data: FTType) => mutation.mutate(data);

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
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Please wait..."
            : data?.id
            ? "Update"
            : "Proceed"}
        </Button>
      </div>
    </form>
  );
}
