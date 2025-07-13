"use client";

import CustomPageLayout from "@/components/custom/layout/page-layout";
import CardLink from "@/components/custom/link/card-link";
import NewNavbar from "@/components/custom/navbar/navbar";
import {
  useSelectAllProjectsByProgramIDHook,
  useSelectLocationByID,
} from "@/components/hooks";
import { ProgramSidebar } from "@/components/sidebar/program-sidebar";
import { ProjectType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DashboardPage() {
  const { programID } = useParams();
  const { data: projectData } = useSelectAllProjectsByProgramIDHook(
    programID as string
  );
  return (
    <CustomPageLayout>
      <Link href={`/dashboard/new/${programID}`}>
        <Button className="mb-4" size={"sm"}>
          <Plus /> Create new project
        </Button>
      </Link>
      <div className="flex flex-wrap justify-start items-center gap-2">
        {Array.isArray(projectData) && projectData.length > 0 ? (
          projectData.map((project: ProjectType) => (
            <CardLink
              href={`/dashboard/projects/${project.id}`}
              key={project.id}
              className="h-[176px] min-w-[360px] flex flex-col justify-between items-start h-full"
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
    </CustomPageLayout>
  );
}

export function GetLocation({ projectID }: { projectID: string }) {
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
        : `${locationData?.province} | ${locationData?.barangay},
            ${locationData?.municipality}`}
    </p>
  );
}
