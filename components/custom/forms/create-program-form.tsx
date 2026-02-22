"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInsertProgramHook } from "../../hooks";
import FormInput from "../input/form-input";
import FormTextarea from "../input/form-textarea";
import { CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useModal } from "../layout/custom-page-layout";
import Link from "next/link";

const formSchema = z.object({
  program_name: z
    .string()
    .min(10, "Program name is required")
    .refine((val) => !/\d/.test(val), {
      message: "Program name cannot contain numbers",
    }),
  description: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

export default function CreateProgramForm() {
  const { openModal, closeModal } = useModal();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program_name: "",
      description: "",
    },
  });

  const { mutate, isPending } = useInsertProgramHook();
  const handleSubmit = (data: FormData) =>
    mutate({ ...data, project_count: [] });

  return (
    <>
      <form
        className="space-y-4 p-2"
        id="create-program-form"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormInput label="Program Name" name="program_name" form={form} />
        <FormTextarea
          label="Description"
          name="description"
          form={form}
          optional
        />
      </form>
      <CardFooter className="flex-col gap-2 border-t p-2">
        <Button
          size="sm"
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
              </Button>,
            );
          }}
          className="w-full px-4 py-2"
          variant={isPending ? "ghost" : "default"}
          disabled={isPending}
        >
          {isPending ? <Spinner /> : "Create Program"}
        </Button>
        <Button
          size="sm"
          variant={"outline"}
          className="w-full"
          disabled={isPending}
          asChild
        >
          <Link href="/dashboard/programs" prefetch={true}>
            Cancel
          </Link>
        </Button>
      </CardFooter>
    </>
  );
}
