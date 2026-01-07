"use client";

import { SelectProjectByIDsAction } from "@/app/actions/QuickAccessAction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState, useEffect } from "react";

export default function ProjectQuickAccessCard() {
  const [projectIDs, setProjectIDs] = useState<string[]>([]);

  // Read from localStorage on mount and listen for changes
  useEffect(() => {
    // Initial read
    const initialIDs = getQuickAccessProjects();
    setProjectIDs(initialIDs);

    // Listen for storage changes (when localStorage is updated in other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "quickAccessProjects") {
        const newIDs = getQuickAccessProjects();
        setProjectIDs(newIDs);
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = () => {
      const newIDs = getQuickAccessProjects();
      setProjectIDs(newIDs);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("quickAccessUpdated", handleCustomStorageChange);

    // Poll for changes (in case custom events aren't fired)
    const interval = setInterval(() => {
      const currentIDs = getQuickAccessProjects();
      setProjectIDs((prevIDs) => {
        if (JSON.stringify(currentIDs) !== JSON.stringify(prevIDs)) {
          return currentIDs;
        }
        return prevIDs;
      });
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("quickAccessUpdated", handleCustomStorageChange);
      clearInterval(interval);
    };
  }, []);

  const { data } = useRealtimeQuery({
    queryKey: ["quick-access-projects", ...projectIDs],
    queryFn: () => SelectProjectByIDsAction(projectIDs.length > 0 ? projectIDs : []),
    table: "projects",
  });

  return (
    <section className="h-full w-full">
      <Card className="p-2 rounded-md shadow-xs">
        <CardHeader className="items-center p-0">
          <CardTitle className="text-lg">Quick Access</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
                      <pre>{project.location ?? ""}</pre>
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
        </CardContent>
      </Card>
    </section>
  );
}
