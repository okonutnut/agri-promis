import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useSelectAllAssignedProjectsByFCAIDHook } from "@/components/hooks";
import { Badge } from "@/components/ui/badge";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import { useEffect } from "react";
import { format } from "date-fns";

type FCAPanelProps = {
  fcaID: string;
};
export default function FCAPanel({ fcaID }: FCAPanelProps) {
  const { data, isLoading, refetch } =
    useSelectAllAssignedProjectsByFCAIDHook(fcaID);

  // Refetch when userId changes
  useEffect(() => {
    if (fcaID) {
      refetch();
    }
  }, [fcaID, refetch]);

  return (
    <>
      <Label className="ms-3">Assigned Projects</Label>
      {isLoading ? (
        <SkeletonLoading />
      ) : data?.length === 0 ? (
        <center className="italic p-4 text-sm text-muted-foreground">
          No assigned programs or projects found.
        </center>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {data?.map((project, index) => (
            <Card
              className="mx-3 shadow-xs rounded-md p-2 flex flex-row justify-between items-start"
              key={index}
            >
              <div className="flex flex-col gap-1 text-sm">
                <strong className="font-medium">{project.project_name}</strong>
                <small className="text-muted-foreground">
                  {format(new Date(project.created_at), "PPp") ??
                    "Not Specified"}
                </small>
              </div>
              <Badge>PROJECT</Badge>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
