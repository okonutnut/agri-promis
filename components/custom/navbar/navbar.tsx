"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Boxes, Check, Slash, ChevronsUpDown, Plus, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, usePathname } from "next/navigation";
import {
  useSelectAllProgramsByAgriculturistHook,
  useSelectAllProjectsByProgramIDHook,
  useSelectProgramAndProjectDetailsByProgjectIDHook,
} from "@/components/hooks";
import { ProgramType, ProjectType } from "@/components/types";
import Link from "next/link";
import NavbarUserImage from "./navbar-user-image";
import { useMemo } from "react";

export default function Navbar() {
  const { programID, projectID } = useParams();
  const currentPath = usePathname();

  // Program Data
  const { data: allProgramsData } = useSelectAllProgramsByAgriculturistHook();
  const programData = useMemo(() => {
    return allProgramsData?.find(
      (program: ProgramType) => program.id === programID
    );
  }, [programID, allProgramsData]);

  // Project Data
  const { data: programProjectsData } =
    useSelectProgramAndProjectDetailsByProgjectIDHook(projectID as string);

  const { data: allProjectsByProgramIDData } =
    useSelectAllProjectsByProgramIDHook(
      programProjectsData?.program_id as string
    );

  return (
    <nav className="w-full flex items-center justify-between h-12 px-4 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center gap-4 overflow-x-auto overflow-y-hidden w-full">
        <div className="flex items-center gap-2 min-w-max">
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={50}
            height={50}
            className="h-8 w-8 flex-shrink-0"
          />
          <span className="text-gray-400">
            <Slash className="h-3 w-3 mx-1" />
          </span>
          {programID || projectID ? (
            <>
              <div className="flex items-center gap-2 min-w-max">
                <DropdownMenu>
                  <Link
                    href={`/dashboard/programs/${
                      programID ?? programProjectsData?.program_id
                    }`}
                    className="text-black flex items-center gap-2 text-sm font-medium cursor-pointer whitespace-nowrap"
                  >
                    <Boxes className="h-4 w-4 flex-shrink-0" />
                    <span className="min-w-[150px] truncate">
                      {programData?.program_name ??
                        programProjectsData?.programs.program_name ??
                        "Loading..."}
                    </span>
                  </Link>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="ml-2 h-7 w-4 flex-shrink-0"
                      variant="ghost"
                    >
                      <ChevronsUpDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {allProgramsData?.map((program: ProgramType) => (
                      <Link
                        key={program.id}
                        href={`/dashboard/programs/${program.id}`}
                      >
                        <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100 font-medium">
                          {program?.program_name ?? "Loading..."}
                          {program.id === programID && (
                            <Check className="ml-2 h-4 w-4" />
                          )}
                        </DropdownMenuItem>
                      </Link>
                    ))}
                    <Link href="/dashboard/programs">
                      <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100 font-medium">
                        All Programs
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={"/dashboard/new"}
                        className="text-xs font-semibold justify-start w-full h-6"
                      >
                        <Plus />
                        Add new program
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {projectID && (
                <>
                  <span className="text-gray-400">
                    <Slash className="h-3 w-3 mx-1" />
                  </span>
                  <DropdownMenu>
                    <Link
                      href={`/dashboard/projects/${programProjectsData?.id}`}
                      className="text-black text-sm font-medium whitespace-nowrap flex items-center gap-2 h-full"
                    >
                      <Box className="h-4 w-4 flex-shrink-0" />
                      <span className="min-w-[150px] truncate inline-block">
                        {programProjectsData?.project_name ?? "Loading..."}
                      </span>
                    </Link>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-2 h-7 w-4 flex-shrink-0"
                        variant="ghost"
                      >
                        <ChevronsUpDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {allProjectsByProgramIDData?.map(
                        (project: ProjectType) => (
                          <Link
                            key={project.id}
                            href={`/dashboard/projects/${project.id}`}
                          >
                            <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100 font-medium">
                              {project?.project_name ?? "Loading..."}
                              {project.id === programProjectsData?.id && (
                                <Check className="ml-2 h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                          </Link>
                        )
                      )}
                      <Link
                        href={`/dashboard/programs/${programProjectsData?.program_id}`}
                      >
                        <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100 font-medium">
                          All Projects
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/new/${programProjectsData?.program_id}`}
                          className="text-xs font-semibold justify-start w-full h-6"
                        >
                          <Plus />
                          Add new program
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </>
          ) : currentPath === "/dashboard/new" ? (
            <span className="text-black whitespace-nowrap text-sm font-medium">
              New Program
            </span>
          ) : (
            <Link
              href="/dashboard/programs"
              className="text-black whitespace-nowrap text-sm font-medium"
            >
              Programs
            </Link>
          )}
        </div>
      </div>
      <NavbarUserImage />
    </nav>
  );
}
