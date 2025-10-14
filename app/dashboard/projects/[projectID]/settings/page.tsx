"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { ProgramType, ProjectType } from "@/components/types";
import { useMemo } from "react";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectProjectDetailsByProjectIDAction } from "@/app/actions/ProjectAction";
import { useSupabaseSession } from "@/hooks/use-session";
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

  const { data: userData } = useSupabaseSession();
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["project_details"],
    queryFn: () => SelectProjectDetailsByProjectIDAction(projectID as string),
    table: "projects",
  });

  const isAdmin = useMemo(() => {
    return userData?.user.id === data?.programs?.admin_id;
  }, [userData, data]);

  return (
    <CustomPageLayout
      pageTitle="Project Settings"
      pageDescription="Manage project details and settings."
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
