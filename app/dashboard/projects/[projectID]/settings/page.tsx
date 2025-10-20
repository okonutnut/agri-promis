"use client";

import { Card } from "@/components/ui/card";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { ProgramType, ProjectType } from "@/components/types";
import { useMemo } from "react";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectProjectDetailsByProjectIDAction } from "@/app/actions/ProjectAction";
import { useSupabaseSession } from "@/hooks/use-session";
import DeleteProjectCard from "./components/delete-project-card";
import EditProjectForm from "./form/edit-project-form";

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
        <EditProjectForm
          project={data as ProjectType & { programs: ProgramType }}
          isAdmin={isAdmin}
        />
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
