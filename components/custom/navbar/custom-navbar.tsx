"use client";

import Image from "next/image";
import {
  Check,
  Slash,
  ChevronsUpDown,
  Box,
  AlignLeft,
  Plus,
  Boxes,
  MapPin,
  ChevronRight,
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
import {
  ProgramType,
  ProjectLocationType,
  ProjectType,
} from "@/components/types";
import { useMemo, useState, useEffect, memo } from "react";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllProgramsWithProjectsAction } from "@/app/actions/ProgramAction";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectAllAssignedProjectsByFieldTechnicianIDAction } from "@/app/actions/AssignedProjectAction";
// removed unused Spinner import

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

const ProgramDropdown = memo(
  ({
    programID,
    allPrograms,
  }: {
    programID?: string;
    allPrograms: ProgramType[];
  }) => {
    const currentProgram = allPrograms.find((p) => p.id === programID);
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>(programID);

    useEffect(() => {
      setValue(programID);
    }, [programID]);

    return (
      <div className="flex items-center gap-2 min-w-max">
        <Popover open={open} onOpenChange={setOpen}>
          <Boxes className="h-4 w-4 text-[#707070]" />
          <span className="min-w-[150px] truncate">
            {currentProgram?.program_name ?? (
              <Skeleton className="w-full h-5" />
            )}
          </span>
          <PopoverTrigger asChild>
            <Button className="ml-2 h-7 w-4 text-[#707070]" variant="ghost">
              <ChevronsUpDown />
            </Button>
          </PopoverTrigger>

          <PopoverContent align="start" className="m-1 p-0 w-[300px]">
            <Command>
              <CommandInput placeholder="Search programs..." />
              <CommandList>
                <CommandEmpty>No program found.</CommandEmpty>
                <CommandGroup>
                  {allPrograms.map((program) => (
                    <CommandItem
                      key={program.id}
                      value={program.id}
                      onSelect={() => {
                        setValue(program.id);
                        setOpen(false);
                        router.push(`/dashboard/programs/${program.id}`);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{program.program_name}</span>
                        {program.id === value && (
                          <Check className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <Separator />

            <Link href={PATHS.PROGRAMS} prefetch={true}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-medium"
              >
                All Programs
              </Button>
            </Link>

            <Separator />
            <Link href={PATHS.NEW_PROGRAM} prefetch={true}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <Plus className="h-4 w-4 mr-1" /> New Program
              </Button>
            </Link>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

const ProjectDropdown = memo(
  ({
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
    const currentProject = projects.find((p: ProjectType) =>
      p.project_location?.some((location) => location.id === projectID)
    );
    const currentProjectLocation = currentProject?.project_location?.find(
      (location) => location.id === projectID
    );
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>(projectID);

    useEffect(() => {
      setValue(projectID);
    }, [projectID]);

    return (
      <>
        <Popover open={open} onOpenChange={setOpen}>
          <Link
            href={pathname}
            className="text-black flex items-center gap-2 whitespace-nowrap"
          >
            <Box className="h-4 w-4 text-[#707070]" />
            <span className="min-w-[150px] truncate">
              {currentProject ? (
                <span className="flex items-center gap-2">
                  {currentProject?.project_name}
                  <ChevronRight className="mx-1 h-3 w-3 text-gray-400" />
                  <MapPin className="h-4 w-4 text-[#707070] mr-1" />
                  <small>{currentProjectLocation?.location}</small>
                </span>
              ) : (
                <Skeleton className="w-full h-5" />
              )}
            </span>
          </Link>

          <PopoverTrigger asChild>
            <Button className="ml-2 h-7 w-4 text-[#707070]" variant="ghost">
              <ChevronsUpDown />
            </Button>
          </PopoverTrigger>

          <PopoverContent align="start" className="m-1 p-0 w-[300px]">
            <Command>
              <CommandInput placeholder="Search projects..." />
              <CommandList>
                <CommandEmpty>No project found.</CommandEmpty>
                <CommandGroup>
                  {projects.map((project: ProjectType, index: number) => {
                    const href = `${
                      role == "admin" ? PATHS.PROGRAMS : PATHS.FIELD_TECHNICIAN
                    }/${project.program_id}?i=${index}`;
                    return (
                      <CommandItem
                        key={project.id}
                        value={project.id}
                        onSelect={() => {
                          setValue(project.id);
                          setOpen(false);
                          router.push(href);
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{project.project_name}</span>
                          {project.id === value && (
                            <Check className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
            <Separator />

            <Link href={`/dashboard/programs/${program.id}`} prefetch={true}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-medium"
              >
                All Projects
              </Button>
            </Link>

            {role === "admin" && (
              <>
                <Separator />
                <Link href={`/dashboard/new/${program.id}`} prefetch={true}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-1" /> New Project
                  </Button>
                </Link>
              </>
            )}
          </PopoverContent>
        </Popover>
      </>
    );
  }
);

const UserProjectsDropdown = memo(function UserProjectsDropdown() {
  const { projectID } = useParams();

  const { data } = useRealtimeQuery({
    queryFn: SelectAllAssignedProjectsByFieldTechnicianIDAction,
    queryKey: ["assignedProjectsByUserID"],
    table: "assigned_projects",
  });

  const currentProject = data?.find(
    (project: ProjectLocationType) => project.id === projectID
  );
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(projectID as string);

  useEffect(() => {
    setValue(projectID as string);
  }, [projectID]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2 min-w-max">
          <Box className="h-4 w-4 text-[#707070]" />
          <div className="min-w-[150px] truncate">
            {currentProject ? (
              <span className="flex items-center gap-2">
                {currentProject?.projects.project_name}
                <ChevronRight className="mx-1 h-3 w-3 text-gray-400" />
                <MapPin className="h-4 w-4 text-[#707070] mr-1" />
                <small>{currentProject?.location}</small>
              </span>
            ) : (
              <Skeleton className="w-full h-5" />
            )}
          </div>
        </div>
        <PopoverTrigger asChild>
          <Button className="ml-2 h-7 w-4 text-[#707070]" variant="ghost">
            <ChevronsUpDown />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="m-1 p-0 w-[300px]">
          <Command>
            <CommandInput placeholder="Search projects..." />
            <CommandList>
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup>
                {(data ?? []).map((project: ProjectLocationType) => (
                  <CommandItem
                    key={project.id}
                    value={project.id}
                    onSelect={(currentValue: string) => {
                      setValue(currentValue);
                      setOpen(false);
                      router.push(`/field-technician/projects/${currentValue}`);
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        {project.projects?.project_name}
                      </span>
                      <small className="flex items-center">
                        <MapPin className="h-4 w-4 text-[#707070] mr-1" />{" "}
                        {project.location}
                      </small>
                    </div>
                    {project.id === value && <Check className="ml-2 h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <Separator />
          <Link href="/field-technician/projects" prefetch={true}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start font-medium"
            >
              All Projects
            </Button>
          </Link>
        </PopoverContent>
      </Popover>
    </>
  );
});

interface CustomNavbarProps {
  role: "admin" | "user";
  noSidebar?: boolean;
  navItems?: any[];
  pageTitle?: string;
  navbarTitle?: string;
}

function getProgramIDProjectLocationID(
  projectID: string,
  programs?: ProgramType[]
): ProgramType | undefined {
  if (!projectID || !programs) return undefined;
  for (const program of programs) {
    if (
      program.projects?.some((project: ProjectType) =>
        project.project_location?.some((location) => location.id === projectID)
      )
    ) {
      return program;
    }
  }
  return undefined;
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

  const currentProgram = useMemo(() => {
    if (programID && programs) {
      return programs.find((p) => p.id === programID);
    }
    if (projectID && programs) {
      return getProgramIDProjectLocationID(projectID as string, programs);
    }
    return undefined;
  }, [programID, projectID, programs]);

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
                {role === "admin" ? (
                  <>
                    <ProgramDropdown
                      programID={(programID as string) ?? currentProgram?.id}
                      allPrograms={programs ?? []}
                    />

                    {currentProgram && projectID && (
                      <ProjectDropdown
                        program={currentProgram}
                        projectID={projectID as string}
                        role={role}
                      />
                    )}
                  </>
                ) : (
                  <UserProjectsDropdown />
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
