"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../input/form-input";
import { useInsertProjectHook } from "@/components/hooks";
import { useParams } from "next/navigation";

const formSchema = z
  .object({
    project_name: z
      .string()
      .min(1, "Project name is required")
      .max(20, "Project name cannot exceed 20 characters")
      .refine((val) => !/\d/.test(val), {
        message: "Project name cannot contain numbers",
      }),
    crop_type: z
      .string()
      .min(1, "Crop type is required")
      .max(20, "Crop type cannot exceed 20 characters")
      .refine((val) => !/\d/.test(val), {
        message: "Crop type cannot contain numbers",
      }),
    start_date: z.string().refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(date.getTime()) && date >= today;
      },
      { message: "Start date cannot be in the past" }
    ),
    end_date: z.string(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["end_date"],
      });
    }
  });
type FormData = z.infer<typeof formSchema>;

export default function CreateProjectForm() {
  const { programUID } = useParams();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: "",
      crop_type: "",
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .slice(0, 10), // Default to one year later
    },
  });

  const { mutate, isPending } = useInsertProjectHook();
  const handleSubmit = (data: FormData) =>
    mutate({ ...data, program_id: programUID as string });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormInput label="Project Name" name="project_name" form={form} />
      <FormInput label="Crop Type" name="crop_type" form={form} />
      <FormInput label="Start Date" name="start_date" type="date" form={form} />
      <FormInput label="End Date" name="end_date" type="date" form={form} />
      <Button type="submit" className="w-full px-4 py-2" disabled={isPending}>
        {isPending ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}
