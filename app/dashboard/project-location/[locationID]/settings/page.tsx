"use client";

import { useParams } from "next/navigation";
import { getProjectLocationNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectProjectDetailsByProjectLocationIDAction } from "@/app/actions/ProjectAction";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import DeleteProjectCard from "./components/delete-project-card";
import EditProjectForm from "./form/edit-project-form";
import NotFoundPage from "@/app/not-found";

export default function ProgramSettingsPage() {
  const { locationID } = useParams();

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["project_location_details", locationID as string],
    queryFn: () =>
      SelectProjectDetailsByProjectLocationIDAction(locationID as string),
    table: "projects",
  });

  console.log("Project Location Details:", data);

  if (data === undefined && !isLoading) return <NotFoundPage />;

  return (
    <CustomPageLayout
      pageTitle="Project Settings"
      pageDescription="Manage project details and settings."
      isLoading={isLoading}
      error={error}
      navItems={getProjectLocationNavItems(locationID as string)}
    >
      <EditProjectForm project={data} />
      <DeleteProjectCard data={data} />
    </CustomPageLayout>
  );
}
