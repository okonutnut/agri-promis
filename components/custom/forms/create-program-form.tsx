"use client";

import CreateDialog from "@/components/sidebar/create-dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { InsertProgramHook } from "../../hooks";
import FormInput from "../input/form-input";
import FormTextarea from "../input/form-textarea";

const formSchema = z.object({
  program_name: z.string().min(1, "Program name is required"),
  description: z.string().min(1, "Description is required"),
});
type FormData = z.infer<typeof formSchema>;

export default function CreateProgramForm() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program_name: "",
      description: "",
    },
  });

  const { mutate, isPending } = InsertProgramHook();
  const handleSubmit = (data: FormData) => mutate(data);

  return (
    <CreateDialog
      title="Create New Program"
      description="Fill in the details to create a new program."
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      trigger={
        <Button className="w-full text-xs mt-1" variant={"ghost"} size={"sm"}>
          Create new program
        </Button>
      }
    >
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormInput label="Program Name" name="program_name" form={form} />
        <FormTextarea label="Description" name="description" form={form} />
        <Button type="submit" className="w-full px-4 py-2" disabled={isPending}>
          {isPending ? "Creating..." : "Create Program"}
        </Button>
      </form>
    </CreateDialog>
  );
}
