"use client";

import { useState } from "react";
import { Box, ChevronRight, Search } from "lucide-react";
import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { Input } from "@/components/ui/input";
import CardLink from "@/components/custom/link/card-link";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllAssignedProjectsByFieldTechnicianIDAction } from "@/app/actions/AssignedProjectAction";
import growthStages from "@/data/growth-stages.json";
import { CirclePercent } from "@/components/custom/charts/circle-percent";
import { getPercentFromStages } from "@/lib/utils";

export default function FieldTechnicianPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["assigned-projects"],
    queryFn: SelectAllAssignedProjectsByFieldTechnicianIDAction,
    table: "assigned_projects",
  });

  const filteredData = data?.filter((project) =>
    project.project_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CustomPageLayout
      pageTitle="Assigned Projects"
      navItems={getUserDashboardNavItems()}
      isLoading={isLoading}
      error={error}
      role="user"
    >
      {data && data.length > 0 ? (
        <>
          <div className="relative w-full max-w-md mb-4">
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 w-4 h-4 transform -translate-y-1/2 text-gray-500" />
          </div>
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
                      <span className="border rounded-full p-2">
                        <Box className="h-5 w-5 text-gray-500" />
                      </span>
                      <div className="font-semibold flex flex-col gap-2">
                        {project.project_name}
                        <pre className="text-xs font-normal">
                          {project.location}
                        </pre>
                        <small className="font-semibold">
                          {
                            growthStages.find(
                              (stage) =>
                                stage.value ===
                                project.progress_indicator!!.toString()
                            )?.label
                          }
                          &nbsp; Stage
                        </small>
                        <div className="flex items-center justify-end">
                          <span className="w-16 h-16">
                            <CirclePercent
                              percent={getPercentFromStages(
                                growthStages,
                                project.progress_indicator!!.toString()
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
              No results found for &quot;{searchTerm}&quot;. <br />
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
