"use client";

import { useDeleteProgramHook } from "@/components/hooks";
import { ProgramType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useModal } from "@/components/custom/layout/custom-page-layout";

type DeleteProgramCardProps = {
  data: ProgramType;
};
export default function DeleteProgramCard({ data }: DeleteProgramCardProps) {
  const { openModal, closeModal } = useModal();
  const { mutate, isPending } = useDeleteProgramHook(data.id as string);

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
          mutate();
          closeModal();
        }}
      />
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
        className="w-[150px]"
        onClick={handleOpenModal}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Delete Program"
        )}
      </Button>
    </Card>
  );
}
