"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { useSelectProjectDetailsHook } from "@/components/hooks";
import { useParams } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { ProgramType, ProjectType } from "@/components/types";
import { useSelectCurrentUserSessionHook } from "@/app/hooks/UserProfileHook";
import { useMemo } from "react";
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

  const { data: userData } = useSelectCurrentUserSessionHook();
  const { data, isLoading, error } = useSelectProjectDetailsHook(
    projectID as string
  );

  const isAdmin = useMemo(() => {
    return userData?.user.id === data?.programs?.admin_id;
  }, [userData, data]);

  return (
    <CustomPageLayout
      pageTitle="Project Settings"
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(projectID as string)}
    >
      <Card className="shadow-xs mb-4">
        <CardContent className="flex flex-wrap justify-between items-start p-0">
          <EditProjectForm
            project={data as ProjectType & { programs: ProgramType }}
            isAdmin={isAdmin}
          />
        </CardContent>
      </Card>
      {isAdmin && (
        <DeleteProjectCard
          data={data as ProjectType}
          programID={(data && (data.program_id as string)) ?? ""}
        />
      )}
    </CustomPageLayout>
  );
}
