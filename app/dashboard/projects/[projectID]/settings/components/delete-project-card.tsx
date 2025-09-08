"use client";

import { useDeleteProjectHook } from "@/components/hooks";
import { ProjectType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useModal } from "@/components/custom/layout/custom-page-layout";

type DeleteProjectCardProps = {
  data: ProjectType;
  programID: string;
};

export default function DeleteProjectCard({
  data,
  programID,
}: DeleteProjectCardProps) {
  const { openModal, closeModal } = useModal();
  const { mutate, isPending } = useDeleteProjectHook(
    data.id as string,
    programID
  );

  const DeleteModalContent = ({
    projectName,
    onConfirm,
  }: {
    projectName: string;
    onConfirm: () => void;
  }) => {
    const [inputValue, setInputValue] = useState("");
    const confirm =
      inputValue.toLowerCase().trim() === projectName.toLowerCase().trim();

    return (
      <>
        <Separator />
        <center className="text-sm mb-4">
          Type <strong>{projectName}</strong> to continue.
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
          disabled={!confirm || isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Confirm Delete"
          )}
        </Button>
      </>
    );
  };

  const handleOpenModal = () => {
    openModal(
      "Delete Project",
      "Are you sure you want to delete this project? This action cannot be undone.",
      <DeleteModalContent
        projectName={data.project_name as string}
        onConfirm={() => {
          mutate();
          closeModal();
        }}
      />
    );
  };

  return (
    <Card className="shadow-xs bg-red-50 border-red-200">
      <CardContent className="flex flex-col flex-wrap justify-between items-start space-y-4">
        <div className="flex gap-2 items-center font-semibold w-full mb-4 text-red-600">
          <AlertCircle />
          Danger Zone
        </div>
        <span>
          This will delete the project and all associated data. This action
          cannot be undone.
        </span>
        <Button
          variant={isPending ? "ghost" : "destructive"}
          size="sm"
          disabled={isPending}
          onClick={handleOpenModal}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Delete Project"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
