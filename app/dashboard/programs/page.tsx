"use client";

import { Button } from "@/components/ui/button";
import { useSelectAllProgramsByAgriculturistHook } from "@/components/hooks";
import Link from "next/link";
import CustomPageLayout from "@/components/custom/layout/admin-page-layout";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Boxes } from "lucide-react";
import { getDashboardNavItems } from "@/components/sidebar/navitems";

export default function DashboardPage() {
  const { data, isLoading, error } = useSelectAllProgramsByAgriculturistHook();
  return (
    <CustomPageLayout
      pageTitle="Your Programs"
      isLoading={isLoading}
      error={error}
      navItems={getDashboardNavItems()}
    >
      {data && (
        <>
          <Link href="/dashboard/new/">
            <Button className="mb-4" size={"sm"}>
              Create New Program
            </Button>
          </Link>

          {data.length > 0 ? (
            <Card className="md:p-2 shadow-none rounded-md py-0">
              <Table>
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
                            <strong>{program.program_name}</strong> <br />
                            {program.project_count && (
                              <span className="text-xs text-gray-500 font-mono">
                                {program.project_count[0].count} Projects
                              </span>
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
