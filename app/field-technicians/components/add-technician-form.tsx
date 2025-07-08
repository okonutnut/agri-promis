import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InsertFieldTechnician } from "../actions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullname: z.string().min(1, "Fullname is required"),
});

export type addFTType = z.infer<typeof formSchema>;

export function AddFieldTechnicianForm({
  onClose,
}: {
  isAddMode: boolean;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const form = useForm<addFTType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullname: "",
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
      qc.invalidateQueries({ queryKey: ["fieldTechnicians"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to add field technician", {
        position: "bottom-right",
      });
    },
  });
  const onSubmit = (data: addFTType) => mutation.mutate(data);

  return (
    <form className="p-3 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label className="text-sm font-medium text">Email</label>
        <Input
          {...form.register("email")}
          type="email"
          placeholder="Enter email"
        />
      </div>
      <div>
        <label className="text-sm font-medium text">Fullname</label>
        <Input
          {...form.register("fullname")}
          type="text"
          placeholder="Enter fullname"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Please wait..." : "Proceed"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
