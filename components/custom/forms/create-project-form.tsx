"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../input/form-input";
import { useInsertProjectHook } from "@/components/hooks";
import { useParams, useRouter } from "next/navigation";
import { CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import LocationSelector from "@/components/custom/location-selector";

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
    location: z.string().min(1, "Location is required"),
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
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
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
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: "",
      crop_type: "",
      location: "",
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .slice(0, 10),
    },
  });

  const { mutate, isPending } = useInsertProjectHook();
  const handleSubmit = (data: FormData) =>
    mutate({ ...data, program_id: programUID as string });

  return (
    <>
      <form
        className="space-y-4 p-4"
        id="create-project-form"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormInput label="Project Name" name="project_name" form={form} />
        <FormInput label="Crop Type" name="crop_type" form={form} />
        <LocationSelector
          onChange={(location) => form.setValue("location", location)}
        />
        <p className="text-xs text-red-500">
          {(form.formState.errors["location"] as { message?: string })?.message}
        </p>
        <FormInput
          label="Start Date"
          name="start_date"
          type="date"
          form={form}
        />
        <FormInput
          label="Estimated End Date"
          name="end_date"
          type="date"
          form={form}
        />
      </form>
      <CardFooter className="flex-col gap-2 border-t px-4">
        <Button
          form="create-project-form"
          className="w-full"
          variant={isPending ? "ghost" : "default"}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Create Project"}
        </Button>
        <Button
          variant={"outline"}
          className="w-full"
          disabled={isPending}
          onClick={() => router.push(`/dashboard/programs/${programUID}`)}
        >
          Cancel
        </Button>
      </CardFooter>
    </>
  );
}
