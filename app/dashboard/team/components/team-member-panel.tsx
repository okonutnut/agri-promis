"use client";

import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/custom/input/search-input";
import Link from "next/link";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";

type TeamMemberPanelProps = {
  data: any;
  userId: string;
};
export default function TeamMemberPanel({
  userId,
  data,
}: TeamMemberPanelProps) {
  if (!userId) return null;

  const [search, setSearch] = useState("");

  // Combine admin_programs and assigned_fieldtechnicians programs
  const allPrograms = [
    ...(data.admin_programs?.map((p: any) => ({ ...p, type: "admin" })) || []),
    ...(data.assigned_fieldtechnicians?.map((aft: any) => ({
      ...aft.programs,
      type: "assigned",
    })).filter((p: any) => p && p.id) || []),
  ];

  // Remove duplicate programs (same ID)
  const uniquePrograms = Array.from(
    new Map(allPrograms.map((p: any) => [p.id, p])).values()
  );

  // Filter programs by program_name
  const filteredPrograms =
    uniquePrograms.filter((program: any) =>
      program.program_name?.toLowerCase().includes(search.toLowerCase())
    ) || [];

  // Filter assigned_projects by project_name or location
  const filteredProjects =
    data.assigned_projects?.filter((project: any) => {
      const name = project.project_location?.projects.project_name || "";
      const location = project.project_location?.location || "";
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        location.toLowerCase().includes(search.toLowerCase())
      );
    }) || [];

  const total = filteredPrograms.length + filteredProjects.length;

  return (
    <>
      <div className="space-y-2 h-full overflow-y-auto px-3">
        <Label className="mt-2 text-xl">Assigned Programs/Projects</Label>
        <SearchInput setSearchTerm={setSearch} />

        {/* Program Cards */}
        {filteredPrograms.map((program: any) => (
          <Card
            className="shadow-xs rounded-md p-2 flex flex-row justify-between items-start"
            key={program.id}
          >
            <div className="flex flex-col gap-1 text-sm">
              <strong className="font-medium">{program.program_name}</strong>
              <small className="text-muted-foreground">
                {program?.projects?.[0]?.count || program?.projects?.count || 0} Projects
              </small>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className="w-full rounded-md">
                {program.type === "admin" ? "ADMIN" : "ASSIGNED"}
              </Badge>
              <Link href={`/dashboard/programs/${program.id}`} prefetch={true}>
                <Button size={"sm"} variant={"outline"}>
                  View Program
                </Button>
              </Link>
            </div>
          </Card>
        ))}

        {/* Project Cards */}
        {filteredProjects.map((project: any) => (
          <Card
            className="shadow-xs rounded-md p-2 flex flex-row justify-between items-start"
            key={project.id}
          >
            <div className="flex flex-col gap-1 text-sm">
              <strong className="font-medium">
                {project.project_location?.projects.project_name || "N/A"}
              </strong>
              <small className="text-muted-foreground">
                {project.project_location?.location || "N/A"}
              </small>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className="w-full rounded-md">PROJECT</Badge>
              <Link
                href={`/dashboard/projects/${project.project_location?.id}`}
                prefetch={true}
              >
                <Button size={"sm"} variant={"outline"}>
                  View Project
                </Button>
              </Link>
            </div>
          </Card>
        ))}

        {total === 0 && (
          <span className="italic ms-3 text-xs">No results found.</span>
        )}
      </div>
      <CustomSheetFooter />
    </>
  );
}
