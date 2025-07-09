"use client";

import CreateDialog from "@/components/sidebar/create-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProgramAction } from "@/app/actions/programs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  program_name: z.string().min(1, "Program name is required"),
  description: z.string().min(1, "Description is required"),
});
type FormData = z.infer<typeof formSchema>;

export default function CreateProgramForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program_name: "",
      description: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => await createProgramAction(data),
    onSuccess: (response) => {
      // Invalidate and refetch programs data
      queryClient.invalidateQueries({
        queryKey: ["programsByAgriculturist"],
      });

      // Reset form and close dialog
      form.reset();
      setDialogOpen(false);

      // Show success message
      toast.success("Program created successfully!");

      // Navigate to the new program dashboard
      if (response?.data?.id) {
        router.push(`/agriculturist/${response.data.id}/dashboard`);
      }
    },
    onError: (error) => {
      toast.error(`Failed to create program: ${error.message}`);
    },
  });

  const handleSubmit = (data: FormData) => mutate(data);

  return (
    <CreateDialog
      title="Create New Program"
      description="Fill in the details to create a new program."
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      trigger={
        <Button className="w-full text-xs mt-4" variant={"outline"} size={"sm"}>
          Create new program
        </Button>
      }
    >
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <label
            htmlFor="program_name"
            className="block text-sm font-medium text-gray-700"
          >
            Program Name
          </label>
          <Input
            {...form.register("program_name")}
            type="text"
            placeholder="Enter program name..."
            required
            disabled={isPending}
          />
          {form.formState.errors.program_name && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.program_name.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="program_desciption"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <Textarea
            {...form.register("description")}
            rows={5}
            placeholder="Enter program description..."
            required
            disabled={isPending}
          />
          {form.formState.errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full px-4 py-2" disabled={isPending}>
          {isPending ? "Creating..." : "Create Program"}
        </Button>
      </form>
    </CreateDialog>
  );
}
