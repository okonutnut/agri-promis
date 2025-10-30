"use client";

import { useMemo, useState } from "react";
import { ProjectType } from "@/components/types";
import { Box, Check, ChevronRight, Funnel } from "lucide-react";
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
import MunicipalitySelector from "../../../../components/custom/dropdown/municipality-dropdown";
import YearsDropdown from "@/components/custom/dropdown/years-dropdown";
import { getPercentFromStages } from "@/lib/utils";
import { CirclePercent } from "@/components/custom/charts/circle-percent";
import { Badge } from "@/components/ui/badge";
import CardLink from "@/components/custom/link/card-link";
import SearchInput from "@/components/custom/input/search-input";
import { format } from "date-fns";

export default function ProjectsByProgramPage() {
  const { programID } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [projectStatus, setProjectStatus] = useState<number>(1);
  const [yearFilter, setYearFilter] = useState("");

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
        .filter((project: ProjectType) =>
          yearFilter
            ? new Date(project.start_date!).getFullYear().toString() ===
              yearFilter
            : true
        )
        .filter((project: ProjectType) => project.status === projectStatus),
    [data, searchQuery, filter, yearFilter, projectStatus]
  );

  return (
    <CustomPageLayout
      pageTitle="Projects List"
      pageDescription="List of projects under the program."
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <div className="flex flex-wrap items-start gap-2 mb-4">
        <Link href={`/dashboard/new/${programID}`}>
          <Button>New project</Button>
        </Link>
        <div className="w-full md:max-w-md flex flex-nowrap gap-3">
          <SearchInput
            placeholder="Search projects..."
            setSearchTerm={setSearchQuery}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shadow-xs">
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
        <div className="w-full md:max-w-md flex flex-wrap gap-2">
          <MunicipalitySelector onChange={setFilter} />
          <YearsDropdown onChange={setYearFilter} />
        </div>
      </div>
      {filteredProjects && filteredProjects?.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProjects.map((project: ProjectType) => (
            <CardLink
              href={`/dashboard/projects/${project.id}`}
              key={project.id}
              className="group min-w-sm flex flex-col items-start h-full p-4 space-y-2 gap-0"
            >
              <div className="w-full flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <span className="border rounded-full p-2 border-primary">
                    <Box className="h-5 w-5 text-primary" />
                  </span>
                  <div className="font-semibold flex flex-col gap-2">
                    {project.project_name}
                    <pre className="text-xs font-normal">
                      {project.location}
                    </pre>
                    <small>
                      Date Created:&nbsp;
                      {format(new Date(project.created_at!), "PPp")}
                    </small>
                    <Badge className="font-semibold rounded-md">
                      {
                        cornGrowthStages.find(
                          (stage) =>
                            stage.value ===
                            project.progress_indicator!.toString()
                        )?.label
                      }
                      &nbsp; {project.progress_indicator == 1 ? "" : "Stages"}
                    </Badge>
                    <div className="flex items-center justify-end">
                      <span className="w-16 h-16">
                        <CirclePercent
                          percent={getPercentFromStages(
                            cornGrowthStages,
                            project.progress_indicator!.toString()
                          )}
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <span className="ml-2 transform transition-transform group-hover:translate-x-2">
                  <ChevronRight className="h-4 w-4" />
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
