"use client";

import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useSelectAllAssignedProjectsByFCAIDHook } from "@/app/hooks/FCAHook";
import { Badge } from "@/components/ui/badge";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import CustomSheetFooter from "@/components/custom/layout/custom-sheet-footer";

type FCAProjectsProps = {
  fcaID: string;
};
export default function FCAProjects({ fcaID }: FCAProjectsProps) {
  const { data, isLoading, refetch } =
    useSelectAllAssignedProjectsByFCAIDHook(fcaID);

  const [search, setSearch] = useState("");

  // Refetch when userId changes
  useEffect(() => {
    if (fcaID) {
      refetch();
    }
  }, [fcaID, refetch]);

  // Filter projects by search term
  const filteredData = data?.filter((project) =>
    project.project_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto px-3">
          <Label className="mt-2 text-xl">Assigned Projects</Label>
          <Input
            placeholder="Search...."
            className="mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredData?.length === 0 ? (
            <center className="italic p-4 text-sm text-muted-foreground">
              No assigned programs or projects found.
            </center>
          ) : (
            filteredData?.map((project, index) => (
              <Card
                className="shadow-xs rounded-md p-2 flex flex-row justify-between items-start"
                key={index}
              >
                <div className="flex flex-col gap-1 text-sm">
                  <strong className="font-medium">
                    {project.project_name}
                  </strong>
                  <small className="text-muted-foreground">
                    {format(new Date(project.created_at), "PPp") ??
                      "Not Specified"}
                  </small>
                </div>
                <Badge>PROJECT</Badge>
              </Card>
            ))
          )}
        </div>
      )}
      <CustomSheetFooter />
    </>
  );
}
