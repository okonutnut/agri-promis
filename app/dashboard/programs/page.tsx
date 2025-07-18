"use client";

import { Button } from "@/components/ui/button";
import { Boxes } from "lucide-react";
import {
  useSelectAllProgramsByAgriculturistHook,
  useSelectAllProjectsByProgramIDHook,
} from "@/components/hooks";
import CardLink from "@/components/custom/link/card-link";
import Link from "next/link";
import CustomPageLayout from "@/components/custom/layout/page-layout";

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
          <div className="flex flex-wrap items-center gap-2 relative">
            {data.length > 0 ? (
              <>
                {data?.map((program) => (
                  <CardLink
                    href={`/dashboard/programs/${program.id}`}
                    key={program.id}
                    className="min-h-[70px] w-full md:w-[300px] flex flex-row items-center justify-start text-center p-3"
                  >
                    <span className="border border-gray-300 rounded-full p-2">
                      <Boxes className="text-gray-500 h-4 w-4" />
                    </span>
                    <span className="text-start text-xs">
                      <strong>{program.program_name}</strong>
                      {program.id ? (
                        <ProjectCount program_id={program.id} />
                      ) : (
                        <span className="text-xs text-gray-400">No ID</span>
                      )}
                    </span>
                  </CardLink>
                ))}
              </>
            ) : (
              <p className="text-center">No programs found</p>
            )}
          </div>
        </>
      )}
    </CustomPageLayout>
  );
}

function ProjectCount({ program_id }: { program_id: string }) {
  const { data } = useSelectAllProjectsByProgramIDHook(program_id);
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      {data?.length} Projects
    </div>
  );
}
