"use client";

import { useState } from "react";
import { useSelectAssignedProjectsByFieldTechnicianHook } from "@/components/hooks";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Box, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { Input } from "@/components/ui/input";

export default function FieldTechnicianPage() {
  const { data, isLoading, error } =
    useSelectAssignedProjectsByFieldTechnicianHook();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data?.filter((project) =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CustomPageLayout
      pageTitle="Assigned Projects"
      navItems={getUserDashboardNavItems()}
      isLoading={isLoading}
      error={error}
      role="user"
    >
      {data ? (
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
            <>
              <Card className="p-0 shadow-none">
                <Table>
                  <TableBody>
                    {filteredData.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <Link
                            href={`/field-technician/projects/${project.id}`}
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
                              <span className="font-mono text-xs">
                                {project.location}
                              </span>
                            </div>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </>
          ) : (
            <span>
              No results found for &quot;{searchTerm}&quot;. <br />
            </span>
          )}
        </>
      ) : (
        <span>
          No assigned projects found. <br /> Please contact your admin for
          assistance.
        </span>
      )}
    </CustomPageLayout>
  );
}
