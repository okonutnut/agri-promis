"use client";

import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditProgramNameHook } from "@/components/hooks";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProgramType } from "@/components/types";
import NonFormInput from "@/components/custom/input/non-form-input";
const FormInput = dynamic(
  () => import("@/components/custom/input/form-input"),
  {
    ssr: false,
  }
);

const formSchema = z.object({
  program_name: z.string().min(1, "Program name is required"),
  id: z.string().min(1, "Program ID is required"),
});

type EditProgramNameFormProps = {
  programData: ProgramType;
  isAdmin: boolean;
};
export default function EditProgramNameForm({
  programData,
  isAdmin,
}: EditProgramNameFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: programData?.id as string,
      program_name: programData?.program_name ?? "",
    },
  });

  const { mutate, isPending } = useEditProgramNameHook();
  const handleSubmit = (data: z.infer<typeof formSchema>) =>
    mutate({ ...data, project_count: programData.project_count });

  return (
    <>
      <form
        className="w-full flex flex-col items-start space-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormInput label="Program ID" name="id" form={form} readonly copy />
        <FormInput
          label="Program name"
          name="program_name"
          form={form}
          readonly={!isAdmin}
        />
        <NonFormInput
          label="Program Admin / Creator"
          defaultValue={programData.user_profile?.fullname ?? "N/A"}
        />
        {isAdmin && (
          <CardFooter className="w-full justify-end p-0">
            <Button
              type="submit"
              size={"sm"}
              variant={isPending ? "ghost" : "default"}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </CardFooter>
        )}
      </form>
    </>
  );
}
