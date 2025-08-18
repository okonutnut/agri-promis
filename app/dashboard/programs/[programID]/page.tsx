"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useSelectAllProjectsByProgramIDHook } from "@/components/hooks";
import { ProjectType } from "@/components/types";
import { ChevronRight, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import Link from "next/link";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";

const Badge = dynamic(
  () => import("@/components/ui/badge").then((mod) => mod.Badge),
  { ssr: false }
);
const Button = dynamic(
  () => import("@/components/ui/button").then((mod) => mod.Button),
  { ssr: false }
);
const Input = dynamic(
  () => import("@/components/ui/input").then((mod) => mod.Input),
  { ssr: false }
);
const CardLink = dynamic(() => import("@/components/custom/link/card-link"));

export default function ProgramDashboardPage() {
  const { programID } = useParams();
  const { data, isLoading, error } = useSelectAllProjectsByProgramIDHook(
    programID as string
  );
  const [searchQuery, setSearchQuery] = useState("");
  // Filter projects based on the search query
  const filteredProjects = data?.filter((project: ProjectType) =>
    project.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CustomPageLayout
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <div className="flex flex-wrap items-start gap-4 mb-4">
        <Link href={`/dashboard/new/${programID}`}>
          <Button>New project</Button>
        </Link>
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2 top-1/2 w-4 h-4 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
      {filteredProjects && filteredProjects?.length > 0 ? (
        <div className="flex flex-wrap justify-start items-center gap-2">
          {filteredProjects.map((project: ProjectType) => (
            <CardLink
              href={`/dashboard/projects/${project.id}`}
              key={project.id}
              className="group min-h-36 min-w-sm flex flex-col items-start h-full p-5 space-y-2 gap-0"
            >
              <span className="w-full flex justify-between items-center font-semibold">
                {project.project_name}
                <span className="ml-2 transform transition-transform group-hover:translate-x-2">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </span>
              <span className="font-mono text-xs">{project.location}</span>
              <div className="flex items-center justify-between w-full mt-auto">
                <Badge
                  variant={project.status == 1 ? "default" : "destructive"}
                  className={`text-xs uppercase `}
                >
                  {project.status == 1 ? "active" : "inactive"}
                </Badge>
                <span className="font-medium text-xs">72% Completed</span>
              </div>
            </CardLink>
          ))}
        </div>
      ) : (
        <center>No projects found</center>
      )}
    </CustomPageLayout>
  );
}
