"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  Slash,
  ChevronsUpDown,
  Box,
  AlignLeft,
  Plus,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import NavbarUserImage from "./navbar-user-image";
import { Skeleton } from "@/components/ui/skeleton";
import MobileNavbar from "./mobile-nav";
import AppDrawer from "@/components/sidebar/appDrawer";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import {
  useSelectAssignedProjectsByFieldTechnicianHook,
  useSelectAllProgramsByAgriculturistHook,
  useSelectAllProjectsByProgramIDHook,
  useSelectProgramAndProjectDetailsByProgjectIDHook,
} from "@/components/hooks";
import {
  NavigationItemType,
  ProgramType,
  ProjectType,
} from "@/components/types";

// Constants
const PATHS = {
  FIELD_TECHNICIAN: "/field-technician/projects",
  NEW_PROGRAM: "/dashboard/new",
  NEW_PROJECT: "/dashboard/new/[programUID]",
  PROGRAMS: "/dashboard/programs",
  TEAM: "/dashboard/team",
  ACTIVITY_LOGS: "/dashboard/activity-logs",
} as const;

// Types
type NavbarProps = {
  role: "admin" | "user";
  noSidebar?: boolean;
  navItems?: NavigationItemType[];
  pageTitle?: string;
};

// Shared Components
const BreadcrumbSeparator = () => (
  <span className="text-gray-400">
    <Slash className="h-3 w-3 mx-1" />
  </span>
);

const ProgramDropdown = ({
  programID,
  programData,
  allProgramsData,
  programProjectsData,
}: {
  programID: string | undefined;
  programData: ProgramType | undefined;
  allProgramsData: ProgramType[] | undefined;
  programProjectsData: any;
}) => {
  const currentProgramID = programID ?? programProjectsData?.program_id;

  return (
    <div className="flex items-center gap-2 min-w-max">
      <DropdownMenu>
        <Link
          href={`/dashboard/programs/${currentProgramID}`}
          className="text-black flex items-center gap-2 cursor-pointer whitespace-nowrap"
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
            <Link key={program.id} href={`/dashboard/programs/${program.id}`}>
              <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
                {program?.program_name ?? <Skeleton className="w-full h-5" />}
                {(program.id === programID ||
                  program.id === currentProgramID) && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
            </Link>
          ))}
          <DropdownMenuSeparator />
          <Link href={PATHS.PROGRAMS}>
            <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
              All Programs
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Link href={PATHS.NEW_PROGRAM}>
            <DropdownMenuItem>
              <Plus />
              New program
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ProjectDropdown = ({
  projectID,
  projects,
}: {
  projectID: string;
  projects: ProjectType[] | undefined;
}) => {
  const currentProject = projects?.find((project) => project.id === projectID);

  return (
    <DropdownMenu>
      <Link
        href={PATHS.FIELD_TECHNICIAN}
        className="text-black whitespace-nowrap flex items-center gap-2 h-full"
      >
        <Box className="h-4 w-4 flex-shrink-0 text-[#707070]" />
        <span className="min-w-[150px] truncate inline-block">
          {currentProject?.project_name ?? <Skeleton className="w-full h-5" />}
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
        {projects?.map((project: ProjectType) => (
          <Link
            key={project.id}
            href={`${PATHS.FIELD_TECHNICIAN}/${project.id}`}
          >
            <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
              {project?.project_name ?? <Skeleton className="w-full h-5" />}
              {project.id === projectID && <Check className="ml-2 h-4 w-4" />}
            </DropdownMenuItem>
          </Link>
        ))}
        <Separator />
        <Link href={PATHS.FIELD_TECHNICIAN}>
          <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
            All Projects
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Main Navbar Component
export default function CustomNavbar({
  role,
  noSidebar,
  navItems,
  pageTitle,
}: NavbarProps) {
  const { programID, projectID } = useParams();
  const hasProgramOrProject = Boolean(programID || projectID);

  // Admin Data
  const { data: allProgramsData } = useSelectAllProgramsByAgriculturistHook();
  const programData = useMemo(() => {
    return allProgramsData?.find(
      (program: ProgramType) => program.id === programID
    );
  }, [programID, allProgramsData]);

  const { data: programProjectsData } =
    useSelectProgramAndProjectDetailsByProgjectIDHook(projectID as string);
  const { data: allProjectsByProgramIDData } =
    useSelectAllProjectsByProgramIDHook(
      programProjectsData?.program_id as string
    );

  // User Data
  const { data: projects } = useSelectAssignedProjectsByFieldTechnicianHook();

  return (
    <>
      <MobileNavbar />
      <nav className="w-full flex items-center justify-between min-h-12 px-2 border-b z-50">
        <div className="flex items-center gap-4 overflow-x-auto overflow-y-hidden w-full">
          <div className="flex items-center gap-2 min-w-max">
            <span className="hidden sm:inline">
              <Image
                src="/logo.png"
                alt="app-logo"
                width={32}
                height={32}
                className="h-8 w-8 flex-shrink-0 text-[#707070]"
              />
            </span>

            {!noSidebar && (
              <AppDrawer
                sidebarOptions={navItems || []}
                trigger={
                  <Button variant="ghost" className="md:hidden sm:hidden">
                    <AlignLeft />
                  </Button>
                }
              />
            )}

            <BreadcrumbSeparator />

            {role === "admin" ? (
              hasProgramOrProject ? (
                <>
                  <ProgramDropdown
                    programID={programID as string}
                    programData={programData}
                    allProgramsData={allProgramsData}
                    programProjectsData={programProjectsData}
                  />
                  {projectID && (
                    <ProjectDropdown
                      projectID={projectID as string}
                      projects={allProjectsByProgramIDData}
                    />
                  )}
                </>
              ) : (
                <span className="text-black whitespace-nowrap">
                  {pageTitle}
                </span>
              )
            ) : (
              role === "user" &&
              (hasProgramOrProject ? (
                <ProjectDropdown
                  projectID={projectID as string}
                  projects={projects}
                />
              ) : (
                <span className="text-black whitespace-nowrap">
                  {pageTitle}
                </span>
              ))
            )}
          </div>
        </div>

        <span className="hidden sm:flex items-center gap-2">
          <NavbarUserImage />
        </span>
      </nav>
    </>
  );
}
