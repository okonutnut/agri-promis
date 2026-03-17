"use client";

import { useState } from "react";
import { Boxes, ChevronRight } from "lucide-react";
import { getUserDashboardNavItems } from "@/components/sidebar/navitems";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import CardLink from "@/components/custom/link/card-link";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllProgramsAssignedToCurrentUserAction } from "@/app/actions/AssignedProgramAction";
import SearchInput from "@/components/custom/input/search-input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AssignedProgramsClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["assigned-programs"],
    queryFn: SelectAllProgramsAssignedToCurrentUserAction,
    table: "assigned_fieldtechnicians",
  });

  const filteredPrograms = data?.filter((program) =>
    program.program_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <CustomPageLayout
      pageTitle="Assigned Programs"
      pageDescription="List of programs you are assigned to."
      navItems={getUserDashboardNavItems()}
      isLoading={isLoading}
      error={error}
      role="user"
    >
      <div className="flex flex-wrap items-start gap-4 mb-4">
        <SearchInput
          setSearchTerm={setSearchQuery}
          className="w-full max-w-md"
          placeholder="Search programs..."
        />
      </div>

      {filteredPrograms && filteredPrograms?.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrograms.map((program) => (
            <CardLink
              href={`/field-technician/programs/${program.id}`}
              key={program.id}
              className="flex flex-col items-start h-[120px] p-4 space-y-2 gap-0"
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
                      {program.project_count?.[0]?.count ?? 0} project/s
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
        <span className="italic">
          No assigned programs found. <br /> Please contact your admin for
          assistance.
        </span>
      )}
    </CustomPageLayout>
  );
}
