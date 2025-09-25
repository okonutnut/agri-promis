"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { ProjectType } from "@/components/types";
import { Check, ChevronRight, Funnel, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import Link from "next/link";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import cornGrowthStages from "@/data/growth-stages.json";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllProjectsByProgramIDAction } from "@/app/actions/ProjectAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MunicipalitySelector from "./components/municipality-dropdown";

const Badge = dynamic(
  () => import("@/components/ui/badge").then((mod) => mod.Badge),
  { ssr: false }
);
const CardLink = dynamic(() => import("@/components/custom/link/card-link"), {
  ssr: false,
});

export default function ProgramDashboardPage() {
  const { programID } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  console.log("Selected Municipality:", filter);
  const [projectStatus, setProjectStatus] = useState<number>(1);

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["allProjectsByProgramId", programID as string],
    queryFn: () => {
      return SelectAllProjectsByProgramIDAction(programID as string);
    },
    table: "projects",
  });

  const filteredProjects = useMemo(
    () =>
      data
        ?.filter((project: ProjectType) =>
          project.project_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
        .filter(
          (project: ProjectType) =>
            filter
              ? project.location?.toLowerCase().includes(filter.toLowerCase())
              : true // If filter is empty ("All"), include all
        )
        .filter((project: ProjectType) => project.status === projectStatus),
    [data, searchQuery, filter, projectStatus]
  );

  return (
    <CustomPageLayout
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <div className="flex flex-wrap items-start gap-2 mb-4">
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
        <MunicipalitySelector onChange={setFilter} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Funnel />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="mx-1">
            <DropdownMenuItem onClick={() => setProjectStatus(1)}>
              {projectStatus === 1 && <Check />}
              <span className={`w-2 h-2 bg-primary rounded-full`} />
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProjectStatus(0)}>
              {projectStatus === 0 && <Check />}
              <span className={`w-2 h-2 bg-red-500 rounded-full`} />
              Inactive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                <span className="font-medium text-xs">
                  {
                    cornGrowthStages.find(
                      (stage) =>
                        stage.value === project.progress_indicator?.toString()
                    )?.label
                  }
                  &nbsp; Stage
                </span>
              </div>
            </CardLink>
          ))}
        </div>
      ) : (
        <span className="italic">No projects found</span>
      )}
    </CustomPageLayout>
  );
}
