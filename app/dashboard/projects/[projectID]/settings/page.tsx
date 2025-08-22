"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { useSelectProgramAndProjectDetailsByProgjectIDHook } from "@/components/hooks";
import { useParams } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { ProgramType, ProjectType } from "@/components/types";
const DeleteProjectCard = dynamic(
  () => import("./components/delete-project-card"),
  {
    ssr: false,
  }
);
const EditProjectForm = dynamic(() => import("./form/edit-project-form"), {
  ssr: false,
});

export default function ProgramSettingsPage() {
  const { projectID } = useParams();
  const { data, isLoading, error } =
    useSelectProgramAndProjectDetailsByProgjectIDHook(projectID as string);

  return (
    <CustomPageLayout
      pageTitle="Project Settings"
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(projectID as string)}
    >
      <Card className="shadow-xs mb-4">
        <CardContent className="flex flex-wrap justify-between items-start">
          <div className="font-semibold w-full mb-4">General Settings</div>
          <EditProjectForm
            project={data as ProjectType & { programs: ProgramType }}
          />
        </CardContent>
      </Card>
      <DeleteProjectCard
        data={data as ProjectType}
        programID={(data && (data.program_id as string)) ?? ""}
      />
    </CustomPageLayout>
  );
}
