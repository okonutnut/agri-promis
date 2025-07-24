"use client";

import CustomPageLayout from "@/components/custom/layout/admin-page-layout";
import CardLink from "@/components/custom/link/card-link";
import { useSelectAllProjectsByProgramIDHook } from "@/components/hooks";
import { ProjectType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GetLocation } from "./components/get-project-location";
import { Badge } from "@/components/ui/badge";
import { getProgramNavItems } from "@/components/sidebar/navitems";

export default function DashboardPage() {
  const { programID } = useParams();
  const { data, isLoading, error } = useSelectAllProjectsByProgramIDHook(
    programID as string
  );

  return (
    <CustomPageLayout
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      {data && (
        <>
          <Link href={`/dashboard/new/${programID}`}>
            <Button className="mb-4" size={"sm"}>
              Create new project
            </Button>
          </Link>
          {data.length > 0 ? (
            <div className="flex flex-wrap justify-start items-center gap-2">
              {data.length > 0 &&
                data.map((project: ProjectType) => (
                  <CardLink
                    href={`/dashboard/projects/${project.id}`}
                    key={project.id}
                    className="min-h-36 min-w-[360px] flex flex-col items-start h-full p-5 space-y-2 gap-0"
                  >
                    <span className="w-full flex justify-between items-center font-semibold">
                      {project.project_name}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </span>
                    <GetLocation projectID={project.location_id ?? ""} />
                    <Badge
                      variant={"outline"}
                      className={`text-xs uppercase ${
                        project.status == 1
                          ? "border-green-600"
                          : "border-red-600"
                      } ${
                        project.status == 1 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {project.status == 1 ? "active" : "inactive"}
                    </Badge>
                  </CardLink>
                ))}
            </div>
          ) : (
            <div>No projects found</div>
          )}
        </>
      )}
    </CustomPageLayout>
  );
}
