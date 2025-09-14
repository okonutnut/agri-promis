"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../input/form-input";
import { useInsertProjectHook } from "@/components/hooks";
import { useParams, useRouter } from "next/navigation";
import { CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import FormTextarea from "../input/form-textarea";
import { useState } from "react";
import { sendNotification } from "@/lib/utils";
const LocationSelector = dynamic(
  () => import("@/components/custom/dropdown/location-selector"),
  {
    ssr: false,
  }
);
const FCASelector = dynamic(() => import("../dropdown/fca-selector"), {
  ssr: false,
});

const formSchema = z.object({
  project_name: z
    .string()
    .min(1, "Project name is required")
    .max(50, "Project name cannot exceed 20 characters")
    .refine((val) => !/\d/.test(val), {
      message: "Project name cannot contain numbers",
    }),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  fca_ids: z.array(z.string()).min(1, "At least one FCA is required"),
  total_alloted_area: z.coerce
    .number()
    .min(1, "At least one hectare per person is required"),
  start_date: z.coerce.string(),
  // .refine(
  //   (val) => {
  //     const date = new Date(val);
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);
  //     return !isNaN(date.getTime()) && date >= today;
  //   },
  //   { message: "Start date cannot be in the past" }
  // ),
  end_date: z.coerce.string(),
});
// .superRefine((data, ctx) => {
//   const start = new Date(data.start_date);
//   const end = new Date(data.end_date);
//   if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "End date must be after start date",
//       path: ["end_date"],
//     });
//   }
// });
type FormData = z.infer<typeof formSchema>;

export default function CreateProjectForm() {
  const { programUID } = useParams();
  const router = useRouter();

  const [disabled, setIsDisabled] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: "",
      description: "",
      location: "",
      fca_ids: [],
      total_alloted_area: 1,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .slice(0, 10),
    },
  });

  const { mutate, isPending } = useInsertProjectHook();
  const handleSubmit = (data: FormData) =>
    mutate(
      {
        ...data,
        program_id: programUID as string,
        description: data.description || "",
        fca_ids: data.fca_ids,
      },
      {
        onSuccess: () => {
          sendNotification("A new project has been created.");
          setIsDisabled(true);
        },
      }
    );

  return (
    <>
      <form
        className="space-y-4 p-4"
        id="create-project-form"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormInput label="Project Name" name="project_name" form={form} />
        <FormTextarea
          label="Description"
          name="description"
          form={form}
          rows={3}
        />
        <FCASelector onChange={(fca) => form.setValue("fca_ids", fca)} />
        <FormInput
          label="Total Alloted Area (Hectares)"
          name="total_alloted_area"
          type="number"
          form={form}
        />
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
          disabled={isPending || disabled}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Create Project"}
        </Button>
        <Button
          variant={"outline"}
          className="w-full"
          disabled={isPending || disabled}
          onClick={() => router.push(`/dashboard/programs/${programUID}`)}
        >
          Cancel
        </Button>
      </CardFooter>
    </>
  );
}
