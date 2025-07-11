"use client";

import CardLink from "@/components/custom/link/card-link";
import NewNavbar from "@/components/custom/navbar/new-navbar";
import {
  useSelectAllProjectsByProgramIDHook,
  useSelectLocationByID,
} from "@/components/hooks";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ProjectType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import { useParams } from "next/navigation";

export default function DashboardPage() {
  const { programID } = useParams();
  const { data: projectData } = useSelectAllProjectsByProgramIDHook(
    programID as string
  );
  console.log("Program Data:", projectData);
  return (
    <section className="w-full h-screen flex flex-col relative">
      <NewNavbar />
      <div className="flex">
        <AppSidebar />
        <div className="w-full px-4 py-6">
          <Button className="mb-4" size={"sm"}>
            <Plus /> Create new project
          </Button>
          <div className="grid grid-cols-3 gap-4">
            {Array.isArray(projectData) && projectData.length > 0 ? (
              projectData.map((project: ProjectType) => (
                <CardLink
                  href={`/dashboard/projects/${project.id}`}
                  key={project.id}
                  className="h-[120px] flex flex-col justify-between items-start h-full"
                >
                  <div className="w-full flex justify-between items-center font-semibold">
                    {project.project_name}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </div>
                  <GetLocation projectID={project.location_id ?? ""} />
                  <span
                    className={`text-xs uppercase font-bold ${
                      project.status == 1 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {project.status == 1 ? "active" : "inactive"}
                  </span>
                </CardLink>
              ))
            ) : (
              <p className="col-span-3 text-sm text-gray-500">
                No projects found for this program.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function GetLocation({ projectID }: { projectID: string }) {
  console.log("Project ID:", projectID);
  const {
    data: locationData,
    isLoading,
    isError,
  } = useSelectLocationByID(projectID);
  return (
    <p className="font-mono">
      {isLoading
        ? "Loading location..."
        : isError
        ? "Error fetching location"
        : `${locationData?.barangay},
            ${locationData?.municipality},
            ${locationData?.province}`}
    </p>
  );
}
