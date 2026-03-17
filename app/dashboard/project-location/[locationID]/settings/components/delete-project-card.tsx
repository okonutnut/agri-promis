"use client";

import { ProjectLocationType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useModal } from "@/components/custom/layout/custom-page-layout";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { toast } from "sonner";
import { SoftDeleteAction } from "@/app/actions/DeleteAction";
import { useRouter } from "next/navigation";

type DeleteProjectLocationCardProps = {
  data: ProjectLocationType;
};

export default function DeleteProjectLocationCard({
  data,
}: DeleteProjectLocationCardProps) {
  const { openModal, closeModal } = useModal();
  const router = useRouter();

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: { tableName: string; recordId: string }) =>
      await SoftDeleteAction(data),
    invalidateKeys: ["project", "project_location", "allProjectsByProgramId", "location", "dashboard_items"],
    onSuccess: () => {
      toast.success("Location deleted successfully.");
      router.replace(
        `/dashboard/programs/${data.projects?.program_id}/projects/${data.project_id}/locations`,
      );
    },
    onError: () => {
      toast.error(`Error deleting location. Please try again.`);
    },
  });

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
        <center className="text-sm mb-4">
          Type <strong>{projectName}</strong> to continue.
        </center>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="mb-4"
        />
        <Button
          className="w-full"
          size="sm"
          variant={"destructive"}
          onClick={onConfirm}
          disabled={!confirm || isPending}
        >
          {isPending ? "Deleting..." : "Confirm Delete"}
        </Button>
      </>
    );
  };

  const handleOpenModal = () => {
    openModal(
      "Attention",
      "Are you sure you want to delete this project? This action cannot be undone.",
      <DeleteModalContent
        projectName={`${data.location}`}
        onConfirm={() => {
          mutate({
            tableName: "project_location",
            recordId: data.id as string,
          });
          closeModal();
        }}
      />,
    );
  };

  return (
    <Card className="rounded-md shadow-xs bg-red-50 border-red-200">
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
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={handleOpenModal}
        >
          {isPending ? "Deleting..." : "Delete Project"}
        </Button>
      </CardContent>
    </Card>
  );
}
