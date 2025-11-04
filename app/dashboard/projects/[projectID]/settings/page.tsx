"use client";

import { useParams } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { useMemo } from "react";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectProjectDetailsByProjectLocationIDAction } from "@/app/actions/ProjectAction";
import { useSupabaseSession } from "@/hooks/use-session";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import DeleteProjectCard from "./components/delete-project-card";
import EditProjectForm from "./form/edit-project-form";
import NotFoundPage from "@/app/not-found";

export default function ProgramSettingsPage() {
  const { projectID } = useParams();
  const { data: userData } = useSupabaseSession();

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["project_details", projectID as string],
    queryFn: () =>
      SelectProjectDetailsByProjectLocationIDAction(projectID as string),
    table: "projects",
  });

  const isAdmin = useMemo(() => {
    return userData?.user.id === data?.projects?.programs?.admin_id;
  }, [userData, data]);

  if (data === undefined) return <NotFoundPage />;

  return (
    <CustomPageLayout
      pageTitle="Project Settings"
      pageDescription="Manage project details and settings."
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(projectID as string)}
    >
      <EditProjectForm project={data} isAdmin={isAdmin} />
      {isAdmin && <DeleteProjectCard data={data} />}
    </CustomPageLayout>
  );
}
