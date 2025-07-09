"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CreateProgramFormData } from "./types";
import { createProgramAction } from "./actions";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  program_name: z.string().min(1, "Program name is required"),
  description: z.string().min(1, "Description is required"),
});
type FormSchemaType = z.infer<typeof formSchema>;

export default function CreateProgramPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program_name: "",
      description: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: CreateProgramFormData) =>
      await createProgramAction(data),
    onSuccess: (data) => {
      if (data.success) {
        qc.invalidateQueries({
          queryKey: ["programs"],
        });
        form.reset();
        toast.success(data.message);
        router.push("/agriculturist/dashboard");
      } else {
        toast.error("Failed to create program. Please try again.");
      }
    },
    onError: (error: any) => {
      toast.error(error);
    },
  });

  const onSubmit = (data: CreateProgramFormData) => {
    mutate({
      program_name: data.program_name,
      description: data.description,
    });
    console.log("Form submitted with data:", data);
  };

  return (
    <>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="max-w-2xl p-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="programName"
                className="block text-sm font-medium uppercase text-primary"
              >
                Program Name
              </label>
              <Input
                {...form.register("program_name")}
                type="text"
                placeholder="Enter program name"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium uppercase text-primary"
              >
                Description
              </label>
              <Textarea
                {...form.register("description")}
                rows={4}
                placeholder="Enter program description"
              />
            </div>
            <Button type="submit">Create Program</Button>
          </div>
        </div>
      </form>
    </>
  );
}
