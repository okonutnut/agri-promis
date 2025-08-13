"use client";

import { Card, CardContent } from "@/components/ui/card";
import EditProgramNameForm from "./form/edit-project-name-form";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { useSelectProgramAndProjectDetailsByProgjectIDHook } from "@/components/hooks";
import { useParams } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import DeleteProjectCard from "./components/delete-project-card";
import { useEffect } from "react";

export default function ProgramSettingsPage() {
  const { projectID } = useParams();
  const { data, isLoading, error, refetch } =
    useSelectProgramAndProjectDetailsByProgjectIDHook(projectID as string);
  useEffect(() => {
    refetch();
  }, [refetch, projectID]);

  return (
    <CustomPageLayout
      pageTitle="Project Settings"
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(projectID as string)}
    >
      {data && (
        <>
          <Card className="shadow-xs mb-4">
            <CardContent className="flex flex-wrap justify-between items-start">
              <div className="font-semibold w-full mb-4">General Settings</div>
              <EditProgramNameForm project={data} />
            </CardContent>
          </Card>
          <DeleteProjectCard
            data={data}
            programID={data.program_id as string}
          />
        </>
      )}
    </CustomPageLayout>
  );
}
