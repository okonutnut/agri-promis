"use client";

import { useMemo, useState } from "react";
import { ProjectType } from "@/components/types";
import { Archive,  ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllProjectsByProgramIDAction } from "@/app/actions/ProjectAction";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import SearchInput from "@/components/custom/input/search-input";
import CardLink from "@/components/custom/link/card-link";

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


type FilteredProjectsProps = {
  projects: ProjectType[];
  searchQuery: string;
};
function FilteredProjects({ projects, searchQuery }: FilteredProjectsProps) {
  const { programID } = useParams();
  const filteredProjects = useSearchFilter(
    projects,
    searchQuery,
    (project, query) =>
      project.project_name!.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {filteredProjects && filteredProjects.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project: ProjectType) => (
            <CardLink
              href={`/dashboard/programs/${programID}/projects/${project.id}`}
              key={project.id}
              className="min-w-sm group flex flex-col items-start p-4 space-y-2 gap-0 h-44 md:h-44 max-h-44"
            >
              <div className="w-full flex justify-between items-start h-full">
                <div className="flex items-start gap-4 w-full">
                  <span className="border rounded-full p-2 border-primary">
                    <Archive className="h-5 w-5 text-primary" />
                  </span>
                  <div className="flex flex-col gap-2 w-full">
                    <span
                      className="font-semibold break-words line-clamp-3 w-full"
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {project.project_name}
                    </span>
                    <small className="italic">
                      {project.description || "No Description"}
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
        <span className="italic">No projects found</span>
      )}
    </>
  );
}

export default function ProjectsByProgramPage() {
  const { programID } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["allProjectsByProgramId", programID as string],
    queryFn: () => {
      return SelectAllProjectsByProgramIDAction(programID as string);
    },
    table: "projects",
  });

  return (
    <CustomPageLayout
      pageTitle="Project List"
      pageDescription="List of projects under the program."
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <div className="flex flex-wrap items-start gap-2 mb-4">
        <Link href={`/dashboard/new/${programID}`} prefetch={true}>
          <Button>New project</Button>
        </Link>
        <div className="w-full md:max-w-md flex flex-nowrap gap-3">
          <SearchInput
            placeholder="Search projects..."
            setSearchTerm={setSearchQuery}
          />
        </div>
      </div>
      {data && (
        <FilteredProjects projects={data} searchQuery={searchQuery} />
      )}
    </CustomPageLayout>
  );
}
