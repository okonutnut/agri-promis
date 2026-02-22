"use client";

import { AlertCircle, ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CustomPageLayout, {
  useModal,
} from "@/components/custom/layout/custom-page-layout";
import { Card } from "@/components/ui/card";
import FormInput from "@/components/custom/input/form-input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextarea from "@/components/custom/input/form-textarea";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import {
  EditProjectAction,
  SelectProjectDetailsByIDAction,
} from "@/app/actions/ProjectAction";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { useEffect, useState } from "react";
import { SoftDeleteAction } from "@/app/actions/DeleteAction";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  project_name: z.string().min(1, "Project name is required"),
  project_description: z.string().optional(),
});

function ProjectSettingsContent({
  form,
  isPending,
  handleSubmit,
  isDeleting,
  handleDelete,
  projectName,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  isPending: boolean;
  handleSubmit: (data: z.infer<typeof formSchema>) => void;
  isDeleting: boolean;
  handleDelete: () => void;
  projectName?: string;
}) {
  const { openModal, closeModal } = useModal();

  function DeleteContent() {
    const [inputValue, setInputValue] = useState("");
    return (
      <>
        <center className="text-sm mb-4">
          Type <br /> <strong>{projectName}</strong> <br /> to continue.
        </center>
        <Input
          value={inputValue}
          className="mb-4"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          disabled={inputValue !== projectName}
          onClick={() => {
            handleDelete();
            closeModal();
          }}
        >
          Confirm Delete
        </Button>
      </>
    );
  }

  return (
    <>
      {/* UPDATE */}
      <Card className="p-2 rounded-md">
        <div className="text-lg font-bold">General Settings</div>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormInput label="Project ID" name="id" form={form} readOnly copy />
          <FormInput label="Project Name" name="project_name" form={form} />
          <FormTextarea
            label="Project Description"
            name="project_description"
            form={form}
          />
          <div className="flex justify-end">
            <Button size="sm" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>

      {/* DELETE */}
      <Card className="rounded-md shadow-xs bg-red-50 border-red-200 p-2">
        <div className="flex gap-2 items-center font-semibold w-full mb-4 text-red-600">
          <AlertCircle />
          Danger Zone
        </div>
        <span>
          To remove this project, please delete all the associated data. This
          action cannot be undone.
        </span>
        <Button
          variant={isDeleting ? "ghost" : "destructive"}
          size="sm"
          disabled={isDeleting}
          className="w-37.5"
          onClick={() => {
            openModal(
              "Attention",
              "Are you sure you want to delete this project? This action cannot be undone.",
              <DeleteContent />,
            );
          }}
        >
          {isDeleting ? (
            <>
              <Spinner /> Deleting...
            </>
          ) : (
            "Delete Project"
          )}
        </Button>
      </Card>
    </>
  );
}

export default function ProjectSettingsPage() {
  const { programID, projectID } = useParams();
  const router = useRouter();

  // GET PROJECT DETAILS QUERY
  const { data, isLoading, error } = useRealtimeQuery({
    queryFn: async () =>
      await SelectProjectDetailsByIDAction(projectID as string),
    queryKey: ["project_details", projectID as string],
    table: "projects",
  });

  console.log("Project Details Data:", data);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: (projectID as string) || "",
      project_name: "",
      project_description: "",
    },
  });

  useEffect(() => {
    form.setValue("id", (projectID as string) || "");
    form.setValue("project_name", data?.project_name || "");
    form.setValue("project_description", data?.description || "");
  }, [data]);

  // UPDATE PROJECT MUTATION
  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) =>
      EditProjectAction({
        id: data.id,
        project_name: data.project_name,
        description: data.project_description,
      }),
    onSuccess: () => {
      toast.success("Project updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update project. Please try again.");
    },
  });
  const handleSubmit = (data: z.infer<typeof formSchema>) => mutate(data);

  // DELETE PROJECT MUTATION
  const { mutate: deleteProject, isPending: isDeleting } = useUniversalMutation(
    {
      mutationFn: async (data: { tableName: string; recordId: string }) =>
        await SoftDeleteAction({
          tableName: data.tableName,
          recordId: data.recordId,
        }),
      onSuccess: () => {
        toast.success("Project deleted successfully!");
        router.replace(`/dashboard/programs/${programID}/projects`);
      },
      onError: () => {
        toast.error("Failed to delete project. Please try again.");
      },
    },
  );
  const handleDelete = () =>
    deleteProject({ tableName: "projects", recordId: projectID as string });

  return (
    <CustomPageLayout
      pageTitle="Project Settings"
      pageDescription="Manage project settings."
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(programID as string, projectID as string)}
      topRightComponent={
        <Link
          href={`/dashboard/programs/${programID}/projects`}
          prefetch={true}
        >
          <Button variant={"outline"}>
            <ChevronLeft />
            Back
          </Button>
        </Link>
      }
    >
      <ProjectSettingsContent
        form={form}
        isPending={isPending}
        handleSubmit={handleSubmit}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
        projectName={data?.project_name}
      />
    </CustomPageLayout>
  );
}
