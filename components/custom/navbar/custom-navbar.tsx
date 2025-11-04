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
import NotificationRequest from "../notifications/notification";
import { ProgramType } from "@/components/types";
import { useMemo } from "react";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllProgramsWithProjectsAction } from "@/app/actions/ProgramAction";

const PATHS = {
  FIELD_TECHNICIAN: "/field-technician/projects",
  NEW_PROGRAM: "/dashboard/new",
  NEW_PROJECT: "/dashboard/new/[programUID]",
  PROGRAMS: "/dashboard/programs",
  PROJECTS: "/dashboard/projects/",
} as const;

const BreadcrumbSeparator = () => (
  <span className="text-gray-400">
    <Slash className="h-3 w-3 mx-1" />
  </span>
);

const ProgramDropdown = ({
  programID,
  allPrograms,
}: {
  programID?: string;
  allPrograms: ProgramType[];
}) => {
  const currentProgram = allPrograms.find((p) => p.id === programID);

  return (
    <div className="flex items-center gap-2 min-w-max">
      <DropdownMenu>
        <Link
          href={`/dashboard/programs/${currentProgram?.id}`}
          className="text-black flex items-center gap-2 cursor-pointer"
          prefetch={true}
        >
          <Boxes className="h-4 w-4 text-[#707070]" />
          <span className="min-w-[150px] truncate">
            {currentProgram?.program_name ?? (
              <Skeleton className="w-full h-5" />
            )}
          </span>
        </Link>

        <DropdownMenuTrigger asChild>
          <Button className="ml-2 h-7 w-4 text-[#707070]" variant="ghost">
            <ChevronsUpDown />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="m-1">
          {allPrograms.map((program) => (
            <Link
              key={program.id}
              href={`/dashboard/programs/${program.id}`}
              prefetch={true}
            >
              <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
                {program.program_name}
                {program.id === programID && <Check className="ml-2 h-4 w-4" />}
              </DropdownMenuItem>
            </Link>
          ))}

          <DropdownMenuSeparator />
          <Link href={PATHS.PROGRAMS} prefetch={true}>
            <DropdownMenuItem>All Programs</DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />
          <Link href={PATHS.NEW_PROGRAM} prefetch={true}>
            <DropdownMenuItem>
              <Plus className="h-4 w-4 mr-1" /> New Program
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ProjectDropdown = ({
  program,
  projectID,
  role,
}: {
  program: ProgramType;
  projectID?: string;
  role: "admin" | "user";
}) => {
  const pathname = usePathname();
  const projects = program.projects ?? [];
  const currentProject = projects.find((p: any) => p.id === projectID);

  return (
    <DropdownMenu>
      <Link
        href={pathname}
        className="text-black flex items-center gap-2 whitespace-nowrap"
      >
        <Box className="h-4 w-4 text-[#707070]" />
        <span className="min-w-[150px] truncate">
          {currentProject?.project_name ?? <Skeleton className="w-full h-5" />}
        </span>
      </Link>

      <DropdownMenuTrigger asChild>
        <Button className="ml-2 h-7 w-4 text-[#707070]" variant="ghost">
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="m-1">
        {projects.map((project: any) => (
          <Link
            key={project.id}
            href={`${
              role == "admin" ? PATHS.PROJECTS : PATHS.FIELD_TECHNICIAN
            }/${project.id}`}
            prefetch={true}
          >
            <DropdownMenuItem className="justify-between w-full h-7 hover:bg-gray-100">
              {project.project_name}
              {project.id === projectID && <Check className="ml-2 h-4 w-4" />}
            </DropdownMenuItem>
          </Link>
        ))}

        <Separator />

        <Link href={`/dashboard/programs/${program.id}`} prefetch={true}>
          <DropdownMenuItem>All Projects</DropdownMenuItem>
        </Link>

        {role === "admin" && (
          <>
            <Separator />
            <Link href={`/dashboard/new/${program.id}`} prefetch={true}>
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-1" /> New Project
              </DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface CustomNavbarProps {
  role: "admin" | "user";
  noSidebar?: boolean;
  navItems?: any[];
  pageTitle?: string;
}

export default function CustomNavbar({
  role,
  noSidebar,
  navItems,
  pageTitle,
}: CustomNavbarProps) {
  const { programID, projectID } = useParams();
  const { data: programs } = useRealtimeQuery({
    table: "programs",
    queryKey: ["allProgramsByUserIDForNavbar"],
    queryFn: SelectAllProgramsWithProjectsAction,
  });

  const program = useMemo(
    () => programs?.find((p) => p.id === programID),
    [programID, programs]
  );

  return (
    <>
      <MobileNavbar />
      <nav className="bg-primary text-black w-screen flex items-center justify-between h-12 px-2 border-b z-50">
        <div className="flex items-center gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <Link href="/" className="hidden sm:inline cursor-pointer">
              <Image src="/logo.png" alt="app-logo" width={32} height={32} />
            </Link>

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

            {!programID && !projectID ? (
              <span className="text-black whitespace-nowrap">{pageTitle}</span>
            ) : (
              <>
                {program && (
                  <ProgramDropdown
                    programID={programID as string}
                    allPrograms={programs ?? []}
                  />
                )}

                {program && projectID && (
                  <ProjectDropdown
                    program={program}
                    projectID={projectID as string}
                    role={role}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <span className="hidden md:flex items-center gap-3">
          <NotificationRequest />
          <NavbarUserImage />
        </span>
      </nav>
    </>
  );
}
