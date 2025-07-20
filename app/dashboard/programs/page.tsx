"use client";

import { Button } from "@/components/ui/button";
import {
  useSelectAllProgramsByAgriculturistHook,
  useSelectAllProjectsByProgramIDHook,
} from "@/components/hooks";
import Link from "next/link";
import CustomPageLayout from "@/components/custom/layout/admin-page-layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Boxes } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, error } = useSelectAllProgramsByAgriculturistHook();
  return (
    <CustomPageLayout
      pageTitle="Your Programs"
      isLoading={isLoading}
      error={error}
      noSidebar={true}
    >
      {data && (
        <>
          <Link href="/dashboard/new/">
            <Button className="my-7" size={"sm"}>
              Create New Program
            </Button>
          </Link>

          {data.length > 0 ? (
            <Card className="md:p-2 shadow-none rounded-md py-0">
              <Table>
                <TableCaption>Select program to continue</TableCaption>
                <TableBody>
                  {data?.map((program) => (
                    <TableRow
                      key={program.id}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell>
                        <Link
                          href={`/dashboard/programs/${program.id}`}
                          className="flex items-center gap-2 rounded-md p-2"
                        >
                          <span className="flex items-center justify-center w-9 h-9 mx-1 rounded-full bg-gray-100 border">
                            <Boxes className="h-5 w-5 text-gray-500" />
                          </span>
                          <span>
                            <strong>{program.program_name}</strong>
                            {program.id && (
                              <ProjectCount program_id={program.id} />
                            )}
                          </span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <p className="text-center">No programs found</p>
          )}
        </>
      )}
    </CustomPageLayout>
  );
}

function ProjectCount({ program_id }: { program_id: string }) {
  const { data, isLoading } = useSelectAllProjectsByProgramIDHook(program_id);
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      {isLoading && <Skeleton className="h-3 w-[100px]" />}
      {data && (
        <span className="text-gray-500">
          {data.length} {data.length === 1 ? "Project" : "Projects"}
        </span>
      )}
    </div>
  );
}
