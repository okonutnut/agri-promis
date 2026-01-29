"use client";

import { useMemo, useState } from "react";
import { ProjectType } from "@/components/types";
import { Archive, ChevronLeft, ChevronRight, Funnel } from "lucide-react";
import { useParams } from "next/navigation";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllProjectsByProgramIDAction } from "@/app/actions/ProjectAction";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import SearchInput from "@/components/custom/input/search-input";
import CardLink from "@/components/custom/link/card-link";
import { format } from "date-fns";
import MunicipalitySelector from "@/components/custom/dropdown/municipality-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import growthStages from "@/data/growth-stages.json";

function useSearchFilter<T>(
  items: T[],
  searchQuery: string,
  filterFn: (item: T, query: string) => boolean
): T[] {
  return useMemo(
    () => items.filter((item) => filterFn(item, searchQuery)),
    [items, searchQuery, filterFn]
  );
}

export default function ProjectDetailsPage() {
  const { programID, projectID } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["allProjectsByProgramId", programID as string],
    queryFn: () => {
      return SelectAllProjectsByProgramIDAction(programID as string);
    },
    table: "projects",
  });

  // Find the project by ID
  const project = data?.find((p) => p.id === projectID);

  if (!project && !isLoading) {
    return (
      <CustomPageLayout
        pageTitle="Project Not Found"
        pageDescription="The requested project could not be found."
        isLoading={false}
        error={null}
        navItems={getProgramNavItems(programID as string)}
      >
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground">Project not found</p>
          <Link href={`/dashboard/programs/${programID}/projects`}>
            <Button variant="outline" className="mt-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </CustomPageLayout>
    );
  }

  const filteredLocations = useSearchFilter(
    project?.project_location ?? [],
    searchQuery,
    (location, query) =>
      location.location!.toLowerCase().includes(query.toLowerCase())
  )
    .filter((location) =>
      filter
        ? location.location!.toLowerCase().includes(filter.toLowerCase())
        : true
    )
    .filter((location) =>
      statusFilter !== null ? location.status === statusFilter : true
    );

  return (
    <CustomPageLayout
      pageTitle={project?.project_name || "Project Details"}
      pageDescription="Project locations and details."
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
      topRightComponent={
        <Link
          href={`/dashboard/programs/${programID}/projects`}
          prefetch={true}
        >
          <Button variant={"outline"}>
            <ChevronLeft />
            Back
          </Button>
        </Link>
      }
    >
      <div className="flex flex-wrap items-start gap-2 mb-4">
        <Link
          href={`/dashboard/new/${programID}/project/${projectID}`}
          prefetch={true}
        >
          <Button className="px-8">New</Button>
        </Link>
        <div className="w-full md:max-w-md flex flex-nowrap gap-3">
          <SearchInput
            placeholder="Search locations..."
            setSearchTerm={setSearchQuery}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shadow-xs">
                <Funnel />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="mx-1">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                {statusFilter === null && <Check />}
                <span className={`w-2 h-2 bg-gray-500 rounded-full`} />
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter(1)}>
                {statusFilter === 1 && <Check />}
                <span className={`w-2 h-2 bg-primary rounded-full`} />
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter(0)}>
                {statusFilter === 0 && <Check />}
                <span className={`w-2 h-2 bg-red-500 rounded-full`} />
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-full md:max-w-md flex flex-wrap gap-2">
          <MunicipalitySelector onChange={setFilter} />
        </div>
      </div>
      {filteredLocations.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {filteredLocations.map((location, index: number) => (
            <CardLink
              href={`/dashboard/projects/${location.id}`}
              key={index}
              className="h-auto min-w-sm group flex flex-col items-start p-4 space-y-2 gap-0"
            >
              <div className="w-full flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <span className="border rounded-full p-2 border-primary">
                    <Archive className="h-5 w-5 text-primary" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold">{location.location}</span>
                    <small className="italic">
                      {location.description || "No Description"}
                    </small>
                    <Badge className="font-semibold rounded-md">
                      {
                        growthStages.find(
                          (stage) =>
                            stage.value ===
                            location.progress_indicator!.toString()
                        )?.label
                      }
                      &nbsp;
                      {location.progress_indicator == 1 ? "" : "Stages"}
                    </Badge>
                    <small>
                      Date Created:&nbsp;
                      {format(new Date(location.created_at!), "PP")}
                    </small>
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
        <>
          <span className="italic">No project locations found</span>
        </>
      )}
    </CustomPageLayout>
  );
}

