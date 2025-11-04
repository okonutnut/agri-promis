"use client";

import { useState, useMemo } from "react";
import { Box, ChevronRight, Funnel } from "lucide-react";
import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import CardLink from "@/components/custom/link/card-link";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllAssignedProjectsByFieldTechnicianIDAction } from "@/app/actions/AssignedProjectAction";
import growthStages from "@/data/growth-stages.json";
import { CirclePercent } from "@/components/custom/charts/circle-percent";
import { getPercentFromStages } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import MunicipalitySelector from "@/components/custom/dropdown/municipality-dropdown";
import YearsDropdown from "@/components/custom/dropdown/years-dropdown";
import SearchInput from "@/components/custom/input/search-input";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function AssignedProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [projectStatus, setProjectStatus] = useState<number>(1);
  const [yearFilter, setYearFilter] = useState("");

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["assigned-projects"],
    queryFn: SelectAllAssignedProjectsByFieldTechnicianIDAction,
    table: "assigned_projects",
  });

  console.log("Assigned Projects Data:", data);

  const filteredData = useMemo(
    () =>
      data
        ?.filter((project) =>
          project.projects.project_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        .filter((project) =>
          filter
            ? project.location?.toLowerCase().includes(filter.toLowerCase())
            : true
        )
        .filter((project) =>
          yearFilter
            ? new Date(project.start_date!).getFullYear().toString() ===
              yearFilter
            : true
        )
        .filter((project) => project.status === projectStatus),
    [data, searchTerm, filter, yearFilter, projectStatus]
  );

  return (
    <CustomPageLayout
      pageTitle="Assigned Projects"
      pageDescription="List of your assigned projects."
      navItems={getUserDashboardNavItems()}
      isLoading={isLoading}
      error={error}
      role="user"
    >
      <div className="flex flex-wrap items-start gap-2 mb-4">
        <div className="w-full md:max-w-md flex flex-nowrap gap-3">
          <SearchInput
            placeholder="Search projects..."
            setSearchTerm={setSearchTerm}
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
        <div className="w-full md:max-w-md flex flex-wrap gap-2 ">
          <MunicipalitySelector onChange={setFilter} />
          <YearsDropdown onChange={setYearFilter} />
        </div>
      </div>
      {data && data.length > 0 ? (
        <>
          {filteredData && filteredData.length > 0 ? (
            <div className="flex flex-wrap justify-start items-center gap-2">
              {filteredData.map((project) => (
                <CardLink
                  href={`/field-technician/projects/${project.id}`}
                  key={project.id}
                  className="group min-w-sm flex flex-col items-start h-full p-4 space-y-2 gap-0"
                >
                  <div className="w-full flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <span className="border rounded-full p-2 border-primary">
                        <Box className="h-5 w-5 text-primary" />
                      </span>
                      <div className="font-semibold flex flex-col gap-2">
                        {project.projects.project_name}
                        <pre className="text-xs font-normal">
                          {project.location}
                        </pre>
                        <small>
                          Date Created:&nbsp;
                          {format(new Date(project.created_at!), "PPp")}
                        </small>
                        <Badge className="font-semibold rounded-md">
                          {
                            growthStages.find(
                              (stage) =>
                                stage.value ===
                                project.progress_indicator!.toString()
                            )?.label
                          }
                          &nbsp;
                          {project.progress_indicator == 1 ? "" : "Stages"}
                        </Badge>
                        <div className="flex items-center justify-end">
                          <span className="w-16 h-16">
                            <CirclePercent
                              percent={getPercentFromStages(
                                growthStages,
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
            <span>
              No results found. <br />
            </span>
          )}
        </>
      ) : (
        <span className="italic">
          No assigned projects found. <br /> Please contact your admin for
          assistance.
        </span>
      )}
    </CustomPageLayout>
  );
}
