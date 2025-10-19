"use client";

import { SelectProjectByIDsAction } from "@/app/actions/QuickAccessAction";
import { Card } from "@/components/ui/card";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { getQuickAccessProjects } from "@/utils/helpers/quickAccessHooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProjectQuickAccessCard() {
  const { data } = useRealtimeQuery({
    queryKey: ["quick-access-projects"],
    queryFn: () => SelectProjectByIDsAction(getQuickAccessProjects()),
    table: "projects",
  });

  return (
    <section className="h-[200px]">
      <span className="text-lg font-semibold">Quick Access</span>
      <Card className="p-1 rounded-md shadow-xs h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Project Name</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((project) => (
                <TableRow key={project.id} className="h-7 border-b">
                  <TableCell className="text-xs">
                    <strong>{project.project_name}</strong>
                    <pre>{project.location}</pre>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <Button variant={"link"} size={"sm"}>
                        Open
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="h-7">
                <TableCell className="text-xs text-center" colSpan={2}>
                  No Quick Access Projects
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </section>
  );
}
