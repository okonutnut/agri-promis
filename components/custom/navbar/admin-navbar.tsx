"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Boxes,
  Check,
  Slash,
  ChevronsUpDown,
  Plus,
  Box,
  AlignLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, usePathname } from "next/navigation";
import {
  useSelectAllProgramsByAgriculturistHook,
  useSelectAllProjectsByProgramIDHook,
  useSelectProgramAndProjectDetailsByProgjectIDHook,
} from "@/components/hooks";
import {
  NavigationItemType,
  ProgramType,
  ProjectType,
} from "@/components/types";
import Link from "next/link";
import NavbarUserImage from "./navbar-user-image";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import MobileNavbar from "./mobile-nav";
import AppDrawer from "@/components/sidebar/appDrawer";
import NotificationsPanel from "../notifications/notification-panel";

type NavbarProps = {
  noSidebar?: boolean;
  sidebarOptions?: NavigationItemType[];
};
export default function Navbar({ noSidebar, sidebarOptions }: NavbarProps) {
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
    <>
      <MobileNavbar />
      <nav className="w-full flex items-center justify-between min-h-12 px-2 border-b z-50">
        <div className="flex items-center gap-4 overflow-x-auto overflow-y-hidden w-full">
          <div className="flex items-center gap-2 min-w-max">
            <span className="hidden sm:inline">
              <Image
                src={"/logo.png"}
                alt="app-logo"
                width={100}
                height={100}
                className="h-8 w-8 flex-shrink-0 text-[#707070]"
              />
            </span>
            {!noSidebar && (
              <AppDrawer
                sidebarOptions={sidebarOptions}
                trigger={
                  <Button variant={"ghost"} className="md:hidden sm:hidden">
                    <AlignLeft />
                  </Button>
                }
              />
            )}
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
                      className="text-black flex items-center gap-2  cursor-pointer whitespace-nowrap"
                    >
                      <Boxes className="h-4 w-4 flex-shrink-0 text-[#707070]" />
                      <span className="min-w-[150px] truncate">
                        {programData?.program_name ??
                          programProjectsData?.programs.program_name ?? (
                            <Skeleton className="w-full h-5" />
                          )}
                      </span>
                    </Link>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-2 h-7 w-4 flex-shrink-0 text-[#707070]"
                        variant="ghost"
                      >
                        <ChevronsUpDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="m-1">
                      {allProgramsData?.map((program: ProgramType) => (
                        <Link
                          key={program.id}
                          href={`/dashboard/programs/${program.id}`}
                        >
                          <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
                            {program?.program_name ?? (
                              <Skeleton className="w-full h-5" />
                            )}
                            {(program.id === programID ||
                              program.id ===
                                programProjectsData?.program_id) && (
                              <Check className="ml-2 h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                        </Link>
                      ))}
                      <DropdownMenuSeparator />
                      <Link href="/dashboard/programs">
                        <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
                          All Programs
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <Link href={"/dashboard/new"}>
                        <DropdownMenuItem>
                          <Plus />
                          New program
                        </DropdownMenuItem>
                      </Link>
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
                        className="text-black  whitespace-nowrap flex items-center gap-2 h-full"
                      >
                        <Box className="h-4 w-4 flex-shrink-0 text-[#707070]" />
                        <span className="min-w-[150px] truncate inline-block">
                          {programProjectsData?.project_name ?? (
                            <Skeleton className="w-full h-5" />
                          )}
                        </span>
                      </Link>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="ml-2 h-7 w-4 flex-shrink-0 text-[#707070]"
                          variant="ghost"
                        >
                          <ChevronsUpDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="m-1">
                        {allProjectsByProgramIDData?.map(
                          (project: ProjectType) => (
                            <Link
                              key={project.id}
                              href={`/dashboard/projects/${project.id}`}
                            >
                              <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
                                {project?.project_name ?? (
                                  <Skeleton className="w-full h-5" />
                                )}
                                {project.id === programProjectsData?.id && (
                                  <Check className="ml-2 h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                            </Link>
                          )
                        )}
                        <DropdownMenuSeparator />
                        <Link
                          href={`/dashboard/programs/${programProjectsData?.program_id}`}
                        >
                          <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
                            All Projects
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <Link
                          href={`/dashboard/new/${programProjectsData?.program_id}`}
                        >
                          <DropdownMenuItem>
                            <Plus />
                            New project
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </>
            ) : currentPath === "/dashboard/new" ? (
              <span className="text-black whitespace-nowrap ">New Program</span>
            ) : currentPath === "/dashboard/programs" ? (
              <Link
                href="/dashboard/programs"
                className="text-black whitespace-nowrap "
              >
                Programs
              </Link>
            ) : (
              <span className="text-black whitespace-nowrap ">New Project</span>
            )}
          </div>
        </div>
        <span className="hidden sm:flex items-center gap-2">
          <NotificationsPanel />
          <NavbarUserImage />
        </span>
      </nav>
    </>
  );
}
