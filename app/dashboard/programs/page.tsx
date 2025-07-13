"use client";

import NewNavbar from "@/components/custom/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Boxes, Dot, Plus } from "lucide-react";
import {
  useSelectAllProgramsByAgriculturistHook,
  useSelectAllProjectsByProgramIDHook,
} from "@/components/hooks";
import CardLink from "@/components/custom/link/card-link";
import Link from "next/link";

export default function DashboardPage() {
  const { data: programData } = useSelectAllProgramsByAgriculturistHook();
  return (
    <>
      <NewNavbar />
      <section className="w-full py-10">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl">Your Programs</h1>
          <Link href="/dashboard/new/">
            <Button className="my-7" size={"sm"}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Program
            </Button>
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            {programData && programData.length > 0 ? (
              <>
                {programData?.map((program) => (
                  <CardLink
                    href={`/dashboard/programs/${program.id}`}
                    key={program.id}
                    className="basis-3xs w-xs h-[200px] flex flex-col items-center justify-center gap-2 p-4 text-center"
                  >
                    <Boxes className="text-gray-500" />
                    {program.program_name}
                    {program.id ? (
                      <ProjectCount program_id={program.id} />
                    ) : (
                      <span className="text-xs text-gray-400">No ID</span>
                    )}
                  </CardLink>
                ))}
              </>
            ) : (
              <p className="text-center">No programs found</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectCount({ program_id }: { program_id: string }) {
  const { data } = useSelectAllProjectsByProgramIDHook(program_id);
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <Dot className="h-6 w-6 mt-1" />
      {data?.length} Projects
    </div>
  );
}
