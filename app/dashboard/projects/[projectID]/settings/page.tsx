"use client";

import { Card, CardContent } from "@/components/ui/card";
import EditProgramNameForm from "./form/edit-project-name-form";
import CustomPageLayout from "@/components/custom/layout/admin-page-layout";
import { useSelectProgramAndProjectDetailsByProgjectIDHook } from "@/components/hooks";
import { useParams } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";

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
      {data && (
        <Card className="shadow-xs">
          <CardContent className="flex flex-wrap justify-between items-start">
            <div className="font-semibold w-full mb-4">General Settings</div>
            <EditProgramNameForm project={data} />
          </CardContent>
        </Card>
      )}
    </CustomPageLayout>
  );
}
