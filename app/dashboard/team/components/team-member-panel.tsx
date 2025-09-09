"use client";

import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  useSelectAllProgramsByUserIDHook,
  useSelectAllProjectsByUserIDHook,
} from "@/components/hooks";
import { Badge } from "@/components/ui/badge";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type TeamMemberPanelProps = {
  userId: string;
};
export default function TeamMemberPanel({ userId }: TeamMemberPanelProps) {
  if (!userId) return null;

  const {
    data: projects,
    isLoading: isLoadingProjects,
    refetch: refetchProjects,
  } = useSelectAllProjectsByUserIDHook(userId);
  const {
    data: programs,
    isLoading: isLoadingPrograms,
    refetch: refetchPrograms,
  } = useSelectAllProgramsByUserIDHook(userId);

  // Refetch when userId changes
  useEffect(() => {
    if (userId) {
      refetchProjects();
      refetchPrograms();
    }
  }, [userId, refetchProjects, refetchPrograms]);

  const isLoading = isLoadingProjects || isLoadingPrograms;

  // Search state
  const [search, setSearch] = useState("");

  // Filtered data
  const filteredPrograms = programs?.filter((program) =>
    program.program_name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredProjects = projects?.filter((project) =>
    project.project_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {isLoading ? (
        <SkeletonLoading />
      ) : programs?.length === 0 && projects?.length === 0 ? (
        <span className="italic ms-3 text-xs">
          No assigned programs or projects.
        </span>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto px-3">
          <Label className="mt-2 text-xl">Assigned Programs/Projects</Label>
          <Input
            placeholder="Search..."
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredPrograms?.map((program) => (
            <Card
              className="shadow-xs rounded-md p-2 flex flex-row justify-between items-start"
              key={program.id}
            >
              <div className="flex flex-col gap-1 text-sm">
                <strong className="font-medium">{program.program_name}</strong>
                <small className="text-muted-foreground">
                  {program?.project_count?.length || 0} Projects
                </small>
              </div>
              <Badge className="text-xs">PROGRAM</Badge>
            </Card>
          ))}
          {filteredProjects?.map((project) => (
            <Card
              className="shadow-xs rounded-md p-2 flex flex-row justify-between items-start"
              key={project.id}
            >
              <div className="flex flex-col gap-1 text-sm">
                <strong className="font-medium">{project.project_name}</strong>
                <small className="text-muted-foreground">
                  {project.location}
                </small>
              </div>
              <Badge className="text-xs">PROJECT</Badge>
            </Card>
          ))}
          {filteredPrograms?.length === 0 && filteredProjects?.length === 0 && (
            <span className="italic ms-3 text-xs">No results found.</span>
          )}
        </div>
      )}
    </>
  );
}
