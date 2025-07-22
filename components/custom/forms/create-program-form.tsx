"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInsertProgramHook } from "../../hooks";
import FormInput from "../input/form-input";
import FormTextarea from "../input/form-textarea";

const formSchema = z.object({
  program_name: z
    .string()
    .min(1, "Program name is required")
    .max(20, "Program name cannot exceed 20 characters")
    .refine((val) => !/\d/.test(val), {
      message: "Program name cannot contain numbers",
    }),
  description: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

export default function CreateProgramForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program_name: "",
      description: "",
    },
  });

  const { mutate, isPending } = useInsertProgramHook();
  const handleSubmit = (data: FormData) => mutate(data);

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormInput label="Program Name" name="program_name" form={form} />
      <FormTextarea
        label="Description"
        name="description"
        form={form}
        optinal
      />
      <Button
        type="submit"
        className="w-full px-4 py-2"
        size={"sm"}
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Create Program"}
      </Button>
    </form>
  );
}
