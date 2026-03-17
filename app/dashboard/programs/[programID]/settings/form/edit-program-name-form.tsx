"use client";

import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProgramType } from "@/components/types";
import { useModal } from "@/components/custom/layout/custom-page-layout";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { toast } from "sonner";
import { EditProgramNameAction } from "@/app/actions/ProgramAction";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FormInput = dynamic(
  () => import("@/components/custom/input/form-input"),
  {
    ssr: false,
  },
);

const formSchema = z.object({
  id: z.string().min(1, "Program ID is required"),
  program_name: z.string().min(1, "Program name is required"),
  description: z.string().optional(),
  deleted_at: z.string().optional(),
});

type EditProgramNameFormProps = {
  programData: ProgramType;
};
export default function EditProgramNameForm({
  programData,
}: EditProgramNameFormProps) {
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: programData?.id as string,
      program_name: programData?.program_name ?? "",
      description: programData?.description ?? "",
      deleted_at: programData?.deleted_at ?? undefined,
    },
  });

  // EDIT PROGRAM NAME MUTATION
  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) =>
      await EditProgramNameAction(data),
    onSuccess: () => {
      toast.success("Program details updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update program details. Please try again.");
    },
    invalidateKeys: [
      "programs",
      "allProgramsByUserIDForNavbar",
      "assigned-programs",
      "assigned-programs-navbar",
    ],
  });
  const handleSubmit = (data: z.infer<typeof formSchema>) => mutate(data);

  return (
    <>
      {/* UPDATE CARD */}
      <Card className="rounded-md shadow-xs p-2 mb-4">
        <div className="flex gap-2 items-center font-semibold w-full mb-4 ">
          General Settings
        </div>
        <form
          className="w-full flex flex-col items-start space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormInput label="Program ID" name="id" form={form} readOnly copy />
          <FormInput
            label="Program name"
            name="program_name"
            form={form}
            disabled={isPending}
          />
          <CardFooter className="w-full justify-end p-0">
            <Button
              type="button"
              onClick={() =>
                openModal(
                  "Are you sure?",
                  "This action cannot be undone. Do you want to proceed?",
                  <Button
                    onClick={() => {
                      form.handleSubmit(handleSubmit)();
                      closeModal();
                    }}
                    className="w-full"
                  >
                    Confirm
                  </Button>,
                )
              }
              size={"sm"}
              variant={isPending ? "ghost" : "default"}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
