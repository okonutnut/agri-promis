"use client";

import { ProgramType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useModal } from "@/components/custom/layout/custom-page-layout";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { SoftDeleteAction } from "@/app/actions/DeleteAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";

type DeleteProgramCardProps = {
  data: ProgramType;
};
export default function DeleteProgramCard({ data }: DeleteProgramCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: { tableName: string; recordId: string }) =>
      SoftDeleteAction({
        tableName: data.tableName,
        recordId: data.recordId,
      }),
    invalidateKeys: [
      "programs",
      "allProgramsByUserIDForNavbar",
      "assigned-programs",
      "assigned-programs-navbar",
    ],
    onSuccess: () => {
      toast.success("Program deleted successfully!");
      queryClient.removeQueries({ queryKey: ["programs"] });
      router.push("/dashboard/programs");
    },
    onError: () => {
      toast.error("Failed to delete program. Please try again.");
    },
  });

  const DeleteModalContent = ({
    programName,
    onConfirm,
  }: {
    programName: string;
    onConfirm: () => void;
  }) => {
    const [inputValue, setInputValue] = useState("");
    const confirm =
      inputValue.toLowerCase().trim() === programName.toLowerCase().trim();

    return (
      <>
        <center className="text-sm mb-4">
          Type <strong>{programName}</strong> to continue.
        </center>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Separator className="my-4" />
        <Button
          className="w-full"
          variant={"destructive"}
          onClick={onConfirm}
          disabled={!confirm}
        >
          Confirm
        </Button>
      </>
    );
  };

  const handleOpenModal = () => {
    openModal(
      "Delete Program",
      "Are you sure you want to delete this program? This action cannot be undone.",
      <DeleteModalContent
        programName={data.program_name}
        onConfirm={() => {
          mutate({ tableName: "programs", recordId: data.id as string });
          closeModal();
        }}
      />,
    );
  };

  return (
    <Card className="rounded-md shadow-xs bg-red-50 border-red-200 p-2">
      <div className="flex gap-2 items-center font-semibold w-full mb-4 text-red-600">
        <AlertCircle />
        Danger Zone
      </div>
      <span>
        To remove this program, please delete all the associated projects and
        data. This action cannot be undone.
      </span>
      <Button
        variant={isPending ? "ghost" : "destructive"}
        size="sm"
        disabled={isPending}
        className="w-37.5"
        onClick={handleOpenModal}
      >
        {isPending ? (
          <>
            <Spinner className="mr-2" /> Deleting...
          </>
        ) : (
          "Delete Program"
        )}
      </Button>
    </Card>
  );
}
