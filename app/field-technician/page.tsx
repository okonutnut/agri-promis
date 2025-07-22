"use client";

import UserPageLayout from "@/components/custom/layout/user-page-layout";
import { useSelectAssignedProjectsByFieldTechnicianHook } from "@/components/hooks";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { GetLocation } from "../dashboard/programs/[programID]/components/get-project-location";
import { Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FieldTechnicianPage() {
  const { data, isLoading, error } =
    useSelectAssignedProjectsByFieldTechnicianHook();

  return (
    <UserPageLayout
      noSidebar
      pageTitle="Assigned Projects"
      isLoading={isLoading}
      error={error}
    >
      {data && (
        <Card className="p-0 shadow-none">
          <Table>
            <TableBody>
              {data.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link
                      href={`/field-technician/${project.id}/overview`}
                      className="flex justify-start items-center gap-2 p-2"
                    >
                      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 border">
                        <Box className="h-5 w-5 text-gray-500" />
                      </span>
                      <div className="w-full flex flex-col gap-1">
                        <div className="flex w-full justify-between items-center">
                          <strong>{project.project_name}</strong>
                          <Badge>
                            {project.status == 0 ? "INACTIVE" : "ACTIVE"}
                          </Badge>
                        </div>
                        <span>
                          <GetLocation
                            projectID={project.location_id as string}
                          />
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </UserPageLayout>
  );
}
