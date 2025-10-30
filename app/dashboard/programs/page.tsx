"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { Boxes, ChevronRight } from "lucide-react";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import CardLink from "@/components/custom/link/card-link";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllProgramsAction } from "@/app/actions/ProgramAction";
import SearchInput from "@/components/custom/input/search-input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
            <SearchInput
              setSearchTerm={setSearchQuery}
              className="w-full max-w-md"
            />
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
                    <div className="flex items-start gap-4">
                      <span className="border border-primary rounded-full p-2">
                        <Boxes className="h-5 w-5 text-primary" />
                      </span>
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {program.program_name}
                        </span>
                        <small className="mb-2">
                          Created on:&nbsp;
                          {format(new Date(program.created_at!), "PPp")}
                        </small>
                        <Badge className="font-normal rounded-md">
                          {program.project_count[0].count ?? 0} project/s
                        </Badge>
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
