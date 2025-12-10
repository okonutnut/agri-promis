"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { InsertProjectLocationAction } from "@/app/actions/ProjectLocationAction";
import { ProjectLocationType } from "@/components/types";
import z from "zod";
import FormInput from "../input/form-input";
import FormTextarea from "../input/form-textarea";
import LocationSelector from "@/components/custom/dropdown/location-selector";
import FCASelector from "../dropdown/fca-selector";
import { toast } from "sonner";

const formSchema = z.object({
  project_id: z.string().min(1, "Project ID is required"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  fca_ids: z.array(z.string()).optional(),
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
});
type FormData = z.infer<typeof formSchema>;

export default function CreateProjectLocationForm() {
  const { id: projectID, programUID } = useParams();
  const router = useRouter();

  const [disabled, setIsDisabled] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_id: projectID as string,
      description: "",
      location: "",
      fca_ids: [],
      total_alloted_area: 1,
      start_date: new Date().toISOString().slice(0, 10),
    },
  });

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: ProjectLocationType) =>
      await InsertProjectLocationAction(data),
    invalidateKeys: ["allProjectsByProgramId"],
  });
  const handleSubmit = (data: FormData) =>
    mutate(
      {
        ...data,
        project_id: projectID as string,
        description: data.description || "",
        fca_ids: data.fca_ids,
      },
      {
        onSuccess: () => {
          toast.success("Project location created successfully");
          window.location.href = `/dashboard/programs/${programUID}`;
        },
        onError: () => {
          toast.error("Failed to create project location. Please try again.");
        },
        onSettled: () => {
          setIsDisabled(true);
        },
      }
    );

  return (
    <>
      <form
        className="space-y-4 p-2"
        id="create-project-form"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormTextarea
          label="Description"
          name="description"
          form={form}
          rows={3}
        />
        <LocationSelector
          onChange={(location) => form.setValue("location", location)}
        />
        <p className="text-xs text-red-500">
          {(form.formState.errors["location"] as { message?: string })?.message}
        </p>
        <FCASelector onChange={(fca) => form.setValue("fca_ids", fca)} />
        <FormInput
          label="Total Alloted Area (Hectares)"
          name="total_alloted_area"
          type="number"
          form={form}
        />
        <FormInput
          label="Start Date"
          name="start_date"
          type="date"
          form={form}
        />
      </form>
      <CardFooter className="flex-col gap-2 border-t p-2">
        <Button
          form="create-project-form"
          className="w-full"
          variant={isPending ? "ghost" : "default"}
          disabled={isPending || disabled}
        >
          {isPending ? <Spinner /> : "Create Project"}
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
