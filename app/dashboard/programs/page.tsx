"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { Boxes, ChevronRight, Search } from "lucide-react";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import { Input } from "@/components/ui/input";
import CardLink from "@/components/custom/link/card-link";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllProgramsAction } from "@/app/actions/ProgramAction";

export default function ProgramsPage() {
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["programs"],
    queryFn: SelectAllProgramsAction,
    table: "programs",
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Filter programs based on the search query
  const filteredPrograms = data?.filter((program) =>
    program.program_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CustomPageLayout
      pageTitle="Programs"
      pageDescription="Browse and manage all available programs."
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
            <div className="relative w-full max-w-sm">
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
            <div className="flex flex-wrap justify-start items-center gap-2">
              {filteredPrograms.map((program) => (
                <CardLink
                  href={`/dashboard/programs/${program.id}`}
                  key={program.id}
                  className="group min-w-sm flex flex-col items-start h-full p-4 space-y-2 gap-0"
                >
                  <div className="w-full flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <span className="border rounded-full p-2">
                        <Boxes className="h-5 w-5 text-gray-500" />
                      </span>
                      <div className="font-semibold">
                        {program.program_name} <br />
                        <small className="font-normal">
                          {program.project_count[0].count ?? 0} projects
                        </small>
                      </div>
                    </div>
                    <span className="ml-2 transform transition-transform group-hover:translate-x-2">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardLink>
              ))}
            </div>
          ) : (
            <span className="italic">No programs found</span>
          )}
        </>
      )}
    </CustomPageLayout>
  );
}
