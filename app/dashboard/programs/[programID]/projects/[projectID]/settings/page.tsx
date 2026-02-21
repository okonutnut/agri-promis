"use client";

import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { Card, CardFooter } from "@/components/ui/card";
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

const formSchema = z.object({
  project_id: z.string().min(1, "Project ID is required"),
  project_name: z.string().min(1, "Project name is required"),
  project_description: z.string().optional(),
});

export default function ProjectSettingsPage() {
  const { programID, projectID } = useParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_id: projectID as string,
      project_name: "",
      project_description: "",
    },
  });

  // GET PROJECT DETAILS QUERY
  const { data, isLoading, error } = useRealtimeQuery({
    queryFn: async () =>
      await SelectProjectDetailsByIDAction(projectID as string),
    queryKey: ["project_details", projectID as string],
    table: "projects",
  });

  // UPDATE PROJECT MUTATION
  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) =>
      EditProjectAction({
        project_id: data.project_id,
        project_name: data.project_name,
        project_description: data.project_description,
      }),
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => mutate(data);

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
      <Card className="p-2 rounded-md">
        <div className="text-lg font-bold">General Settings</div>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormInput
            label="Project ID"
            name="project_id"
            form={form}
            readOnly
            copy
          />
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
    </CustomPageLayout>
  );
}
