"use client";

import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { format } from "date-fns";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";
import SearchInput from "@/components/custom/input/search-input";
import { ProjectLocationType } from "@/components/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type FCAProjectsProps = {
  assignedProjects?: ProjectLocationType[];
};
export default function FCAProjects({ assignedProjects }: FCAProjectsProps) {
  const [search, setSearch] = useState("");

  // Filter projects based on search term
  const filteredProjects =
    assignedProjects?.filter((project) => {
      const name = project.projects?.project_name?.toLowerCase() ?? "";
      const location = project.location?.toLowerCase() ?? "";
      const searchTerm = search.toLowerCase();
      return name.includes(searchTerm) || location.includes(searchTerm);
    }) ?? [];

  return (
    <>
      <div className="space-y-2 h-full overflow-y-auto px-3">
        <Label className="mt-2 text-xl">Assigned Projects</Label>
        <SearchInput setSearchTerm={setSearch} />
        {filteredProjects.length === 0 ? (
          <center className="italic p-4 text-sm text-muted-foreground">
            No assigned programs or projects found.
          </center>
        ) : (
          filteredProjects.map((project, index) => (
            <Card
              className="shadow-xs rounded-md p-2 flex flex-row justify-between items-start"
              key={index}
            >
              <div className="flex flex-col gap-1 text-sm">
                <strong className="font-medium">
                  {project.projects?.project_name ?? "Not Specified"}
                </strong>
                <span>Location: {project.location ?? "Not Specified"}</span>
                <small className="text-muted-foreground">
                  {format(new Date(project.created_at!), "PPp") ??
                    "Not Specified"}
                </small>
              </div>
              <div className="flex flex-col gap-2">
                <Badge className="w-full rounded-md">PROJECT</Badge>
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  prefetch={true}
                  className="cursor-pointer"
                >
                  <Button variant="outline" size="sm" className="text-xs">
                    View Project
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
      <CustomSheetFooter />
    </>
  );
}
