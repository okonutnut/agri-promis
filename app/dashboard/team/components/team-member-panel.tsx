"use client";

import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
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

  const total =
    data.assigned_projects?.length + data.admin_programs?.length || 0;

  return (
    <>
      <div className="space-y-2 h-full overflow-y-auto px-3">
        <Label className="mt-2 text-xl">Assigned Programs/Projects</Label>
        <Input
          placeholder="Search..."
          className="w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {data.admin_programs?.map((program: any) => (
          <Card
            className="shadow-xs rounded-md p-2 flex flex-row justify-between items-start"
            key={program.id}
          >
            <div className="flex flex-col gap-1 text-sm">
              <strong className="font-medium">{program.program_name}</strong>
              <small className="text-muted-foreground">
                {program?.projects[0]?.count || 0} Projects
              </small>
            </div>
            <Badge className="text-xs">PROGRAM</Badge>
          </Card>
        ))}
        {data.assigned_projects?.map((project: any) => (
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
            <Badge className="text-xs">PROJECT</Badge>
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
