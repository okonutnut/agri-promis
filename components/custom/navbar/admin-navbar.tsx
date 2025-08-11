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

// Constants for path matching
const PATHS = {
  NEW_PROGRAM: "/dashboard/new",
  PROGRAMS: "/dashboard/programs",
  TEAM: "/dashboard/team",
  ACTIVITY_LOGS: "/dashboard/activity-logs",
} as const;

// Types
type NavbarProps = {
  noSidebar?: boolean;
  sidebarOptions?: NavigationItemType[];
};

type ProgramDropdownProps = {
  programID: string | undefined;
  programData: ProgramType | undefined;
  allProgramsData: ProgramType[] | undefined;
  programProjectsData: any;
};

type ProjectDropdownProps = {
  projectID: string;
  programProjectsData: any;
  allProjectsByProgramIDData: ProjectType[] | undefined;
};

// Reusable components
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
}: ProgramDropdownProps) => {
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
          <Link href="/dashboard/programs">
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
  programProjectsData,
  allProjectsByProgramIDData,
}: ProjectDropdownProps) => {
  return (
    <>
      <BreadcrumbSeparator />
      <DropdownMenu>
        <Link
          href={`/dashboard/projects/${programProjectsData?.id}`}
          className="text-black whitespace-nowrap flex items-center gap-2 h-full"
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
          {allProjectsByProgramIDData?.map((project: ProjectType) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
                {project?.project_name ?? <Skeleton className="w-full h-5" />}
                {project.id === programProjectsData?.id && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
            </Link>
          ))}
          <DropdownMenuSeparator />
          <Link href={`/dashboard/programs/${programProjectsData?.program_id}`}>
            <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
              All Projects
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Link href={`/dashboard/new/${programProjectsData?.program_id}`}>
            <DropdownMenuItem>
              <Plus />
              New project
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const BreadcrumbTitle = ({ currentPath }: { currentPath: string }) => {
  const getTitle = () => {
    switch (currentPath) {
      case PATHS.NEW_PROGRAM:
        return { text: "New Program", isLink: false };
      case PATHS.PROGRAMS:
        return { text: "Programs", isLink: true, href: PATHS.PROGRAMS };
      case PATHS.TEAM:
        return { text: "Team", isLink: false };
      case PATHS.ACTIVITY_LOGS:
        return { text: "Activity Logs", isLink: false };
      default:
        return { text: "Schedules", isLink: false };
    }
  };

  const title = getTitle();

  if (title.isLink) {
    return (
      <Link href={title.href!} className="text-black whitespace-nowrap">
        {title.text}
      </Link>
    );
  }

  return <span className="text-black whitespace-nowrap">{title.text}</span>;
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

  const hasProgramOrProject = Boolean(programID || projectID);

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
                sidebarOptions={sidebarOptions}
                trigger={
                  <Button variant="ghost" className="md:hidden sm:hidden">
                    <AlignLeft />
                  </Button>
                }
              />
            )}

            <BreadcrumbSeparator />

            {hasProgramOrProject ? (
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
                    programProjectsData={programProjectsData}
                    allProjectsByProgramIDData={allProjectsByProgramIDData}
                  />
                )}
              </>
            ) : (
              <BreadcrumbTitle currentPath={currentPath} />
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
