"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../input/form-input";
import { useInsertProjectHook } from "@/components/hooks";
import { useParams, useRouter } from "next/navigation";
import { CardFooter } from "@/components/ui/card";
import FormTextarea from "../input/form-textarea";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useModal } from "../layout/custom-page-layout";

const formSchema = z.object({
  project_name: z
    .string()
    .min(10, "Project name is required")
    .refine((val) => !/\d/.test(val), {
      message: "Project name cannot contain numbers",
    }),
  description: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

export default function CreateProjectForm() {
  const { openModal, closeModal } = useModal();
  const { programUID } = useParams();
  const router = useRouter();

  const [disabled, setIsDisabled] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: "",
      description: "",
    },
  });

  const { mutate, isPending } = useInsertProjectHook();
  const handleSubmit = (data: FormData) =>
    mutate(
      {
        ...data,
        program_id: programUID as string,
        description: data.description || "",
      },
      {
        onSuccess: () => {
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
        <FormInput label="Project Name" name="project_name" form={form} />
        <FormTextarea
          label="Description"
          name="description"
          form={form}
          rows={3}
          optional
        />
      </form>
      <CardFooter className="flex-col gap-2 border-t p-2">
        <Button
          type="button"
          onClick={() => {
            openModal(
              "Attention",
              "You confirm that all information provided is correct.",
              <Button
                className="w-full"
                onClick={() => {
                  form.handleSubmit(handleSubmit)();
                  closeModal();
                }}
              >
                Confirm
              </Button>
            );
          }}
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
