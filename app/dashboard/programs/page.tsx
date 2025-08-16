"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelectAllProgramsByAgriculturistHook } from "@/components/hooks";
import Link from "next/link";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Boxes, Search } from "lucide-react";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import { Input } from "@/components/ui/input";

export default function ProgramsPage() {
  const { data, isLoading, error } = useSelectAllProgramsByAgriculturistHook();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter programs based on the search query
  const filteredPrograms = data?.filter((program) =>
    program.program_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CustomPageLayout
      pageTitle="Programs"
      isLoading={isLoading}
      error={error}
      navItems={getDashboardNavItems()}
    >
      {data && (
        <>
          <div className="flex flex-wrap items-start gap-4 mb-4">
            <Link href="/dashboard/new/">
              <Button className="w-full">New Program</Button>
            </Link>
            <div className="relative w-full max-w-xs">
              <Input
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 w-4 h-4 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {filteredPrograms && filteredPrograms?.length > 0 ? (
            <Card className="md:p-2 shadow-none rounded-md py-0">
              <Table>
                <TableBody>
                  {filteredPrograms.map((program) => (
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
