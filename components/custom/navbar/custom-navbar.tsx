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
  Archive,
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
import { SelectAllProgramsAssignedToCurrentUserAction } from "@/app/actions/AssignedProgramAction";
import { SelectAllProjectsByProgramIDAction } from "@/app/actions/ProjectAction";

const PATHS = {
  FIELD_TECHNICIAN: "/field-technician/projects",
  NEW_PROGRAM: "/dashboard/new",
  NEW_PROJECT: "/dashboard/new/[programUID]",
  PROGRAMS: "/dashboard/programs",
  PROJECTS: "/dashboard/project-location/",
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
      <Popover open={open} onOpenChange={setOpen}>
        <Link
          href={PATHS.PROGRAMS}
          prefetch={true}
          className="flex flex-1 gap-2"
        >
          <Boxes className="h-4 w-4 text-[#707070]" />
          <span className="min-w-37.5 truncate">
            {currentProgram?.program_name ?? (
              <Skeleton className="w-full h-5" />
            )}
          </span>
        </Link>
        <PopoverTrigger asChild>
          <Button className="ml-2 h-7 w-4 text-[#707070]" variant="ghost">
            <ChevronsUpDown />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="m-1 p-0 w-75">
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
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-1" /> New Program
            </Button>
          </Link>
        </PopoverContent>
      </Popover>
    );
  },
);

// Component for project location pages (/dashboard/project-location/[projectID])
const ProjectLocationDropdown = memo(
  ({
    program,
    locationID,
    role,
  }: {
    program: ProgramType;
    locationID?: string;
    role: "admin" | "user";
  }) => {
    const projects = program.projects ?? [];
    const currentProject = projects.find((p: ProjectType) =>
      p.project_location?.some((location) => location.id === locationID),
    );
    const currentProjectLocation = currentProject?.project_location?.find(
      (location) => location.id === locationID,
    );
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>(currentProject?.id);

    useEffect(() => {
      setValue(currentProject?.id);
    }, [currentProject?.id]);

    return (
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Archive className="h-4 w-4 text-[#707070]" />
        <span className="min-w-37.5 truncate">
          {currentProject ? (
            <span className="flex items-center gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <span className="flex items-center gap-1">
                  {currentProject?.project_name}
                </span>
                <PopoverTrigger asChild>
                  <Button
                    className="h-7 w-4 text-[#707070] p-0"
                    variant="ghost"
                  >
                    <ChevronsUpDown className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="m-1 p-0 w-75">
                  <Command>
                    <CommandInput placeholder="Search projects..." />
                    <CommandList>
                      <CommandEmpty>No project found.</CommandEmpty>
                      <CommandGroup>
                        {projects.map((project: ProjectType) => (
                          <CommandItem
                            key={project.id}
                            value={project.id}
                            onSelect={() => {
                              setValue(project.id);
                              setOpen(false);
                              router.push(
                                `/dashboard/programs/${program.id}/projects/${project.id}`,
                              );
                            }}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{project.project_name}</span>
                              {project.id === value && (
                                <Check className="ml-2 h-4 w-4" />
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  <Separator />

                  <Link
                    href={`/dashboard/programs/${program.id}/projects`}
                    prefetch={true}
                  >
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
                      <Link
                        href={`/dashboard/new/${program.id}`}
                        prefetch={true}
                      >
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
              <Slash className="mx-1 h-3 w-3 text-gray-400" />
              <Link
                href={`/dashboard/programs/${program.id}/projects/${currentProject.id}`}
                className="flex items-center gap-1 hover:underline"
              >
                <MapPin className="h-4 w-4 text-[#707070]" />
                <span>{currentProjectLocation?.location}</span>
              </Link>
            </span>
          ) : (
            <Skeleton className="w-full h-5" />
          )}
        </span>
      </div>
    );
  },
);

// Component for project details page (/dashboard/programs/[programID]/projects/[projectID])
const ProjectDetailsBreadcrumb = memo(
  ({
    program,
    projectID,
    role,
  }: {
    program: ProgramType;
    projectID?: string;
    role: "admin" | "user";
  }) => {
    const projects = program.projects ?? [];
    const currentProject = projects.find(
      (p: ProjectType) => p.id === projectID,
    );
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>(projectID);

    useEffect(() => {
      setValue(projectID);
    }, [projectID]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <span className="flex flex-1 gap-2">
          <Archive className="h-4 w-4 text-[#707070]" />
          <span className="min-w-37.5 truncate">
            {currentProject?.project_name ?? (
              <Skeleton className="w-full h-5" />
            )}
          </span>
        </span>
        <PopoverTrigger asChild>
          <Button className="ml-2 h-7 w-4 text-[#707070]" variant="ghost">
            <ChevronsUpDown />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="m-1 p-0 w-75">
          <Command>
            <CommandInput placeholder="Search projects..." />
            <CommandList>
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup>
                {projects.map((project: ProjectType) => (
                  <CommandItem
                    key={project.id}
                    value={project.id}
                    onSelect={() => {
                      setValue(project.id);
                      setOpen(false);
                      router.push(
                        `/dashboard/programs/${program.id}/projects/${project.id}`,
                      );
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{project.project_name}</span>
                      {project.id === value && (
                        <Check className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <Separator />

          <Link
            href={`/dashboard/programs/${program.id}/projects`}
            prefetch={true}
          >
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
    );
  },
);

const UserProgramsDropdown = memo(function UserProgramsDropdown({
  programID,
}: {
  programID?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(programID);

  const { data: programs } = useRealtimeQuery({
    queryFn: SelectAllProgramsAssignedToCurrentUserAction,
    queryKey: ["assigned-programs-navbar"],
    table: "assigned_fieldtechnicians",
  });

  const currentProgram = programs?.find((p) => p.id === programID);

  useEffect(() => {
    setValue(programID);
  }, [programID]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Link
        href="/field-technician/projects"
        prefetch={true}
        className="flex flex-1 gap-2"
      >
        <Boxes className="h-4 w-4 text-[#707070]" />
        <div className="min-w-37.5 truncate">
          {currentProgram ? (
            <span>{currentProgram.program_name}</span>
          ) : (
            <Skeleton className="w-full h-5" />
          )}
        </div>
      </Link>
      <PopoverTrigger asChild>
        <Button className="ml-2 h-7 w-4 text-[#707070]" variant="ghost">
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="m-1 p-0 w-75">
        <Command>
          <CommandInput placeholder="Search programs..." />
          <CommandList>
            <CommandEmpty>No program found.</CommandEmpty>
            <CommandGroup>
              {(programs ?? []).map((program: ProgramType) => (
                <CommandItem
                  key={program.id}
                  value={program.id}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue);
                    setOpen(false);
                    router.push(`/field-technician/programs/${currentValue}`);
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{program.program_name}</span>
                    {program.id === value && <Check className="ml-2 h-4 w-4" />}
                  </div>
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
            All Programs
          </Button>
        </Link>
      </PopoverContent>
    </Popover>
  );
});

const UserProjectsDropdown = memo(function UserProjectsDropdown() {
  const { programID, locationID } = useParams();

  const { data } = useRealtimeQuery({
    queryFn: () => SelectAllProjectsByProgramIDAction(programID as string),
    queryKey: ["allProjectsByProgramId", programID as string],
    table: "projects",
  });

  // Find the project that contains the location with matching locationID
  const currentProjectData = useMemo(() => {
    if (!data || !locationID) return null;
    for (const project of data) {
      const location = project.project_location?.find(
        (loc: ProjectLocationType) => loc.id === locationID,
      );
      if (location) {
        return { project, location };
      }
    }
    return null;
  }, [data, locationID]);

  // Flatten all locations from all projects for the dropdown
  // If currentProjectData exists, only show locations from the same project
  const programProjects = useMemo(() => {
    if (!data || !programID) return [];
    const locations: Array<ProjectLocationType & { project: ProjectType }> = [];
    data.forEach((project: ProjectType) => {
      // If we have a current project, only include locations from that project
      if (currentProjectData && project.id !== currentProjectData.project?.id) {
        return;
      }
      project.project_location?.forEach((location: ProjectLocationType) => {
        locations.push({
          ...location,
          project,
        });
      });
    });
    return locations;
  }, [data, programID, currentProjectData]);

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(locationID as string);

  useEffect(() => {
    setValue(locationID as string);
  }, [locationID]);

  const projectLink = useMemo(() => {
    if (!programID) return "/field-technician/projects";
    if (currentProjectData?.project?.id) {
      return `/field-technician/programs/${programID}/projects/${currentProjectData.project.id}`;
    }
    return `/field-technician/programs/${programID}`;
  }, [programID, currentProjectData?.project?.id]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Link href={projectLink} prefetch={true} className="flex flex-1 gap-2">
        <Box className="h-4 w-4 text-[#707070]" />
        <div className="min-w-37.5 truncate">
          {currentProjectData ? (
            <span className="flex items-center gap-2">
              {currentProjectData.project?.project_name}
              <BreadcrumbSeparator />
              <MapPin className="h-4 w-4 text-[#707070] mr-1" />
              <span>{currentProjectData.location?.location}</span>
            </span>
          ) : (
            <Skeleton className="w-full h-5" />
          )}
        </div>
      </Link>
      <PopoverTrigger asChild>
        <Button className="ml-2 h-7 w-4 text-[#707070]" variant="ghost">
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="m-1 p-0 w-75">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              {(programProjects ?? []).map(
                (location: ProjectLocationType & { project: ProjectType }) => (
                  <CommandItem
                    key={location.id}
                    value={location.id}
                    onSelect={(currentValue: string) => {
                      setValue(currentValue);
                      setOpen(false);
                      if (programID) {
                        router.push(
                          `/field-technician/programs/${programID}/location/${currentValue}`,
                        );
                      }
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 text-[#707070] mr-1" />{" "}
                        {location.location}
                      </span>
                    </div>
                    {location.id === value && (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                  </CommandItem>
                ),
              )}
            </CommandGroup>
          </CommandList>
        </Command>
        <Separator />
        <Link
          href={
            programID
              ? `/field-technician/programs/${programID}`
              : "/field-technician/projects"
          }
          prefetch={true}
        >
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
  programs?: ProgramType[],
): ProgramType | undefined {
  if (!projectID || !programs) return undefined;
  for (const program of programs) {
    if (
      program.projects?.some((project: ProjectType) =>
        project.project_location?.some((location) => location.id === projectID),
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
  const { programID, projectID, locationID } = useParams();
  const pathname = usePathname();

  const { data: programs } = useRealtimeQuery({
    table: "programs",
    queryKey: ["allProgramsByUserIDForNavbar"],
    queryFn: SelectAllProgramsWithProjectsAction,
  });

  const { data: userPrograms } = useRealtimeQuery({
    table: "assigned_fieldtechnicians",
    queryKey: ["assigned-programs-navbar"],
    queryFn: SelectAllProgramsAssignedToCurrentUserAction,
  });

  // Determine if we're on a project details page or project location page
  const isProjectDetailsPage = useMemo(() => {
    return (
      pathname?.includes("/programs/") &&
      pathname?.includes("/projects/") &&
      projectID &&
      !pathname?.startsWith("/dashboard/project-location/") &&
      !pathname?.startsWith("/field-technician/programs/")
    );
  }, [pathname, projectID]);

  const isProjectLocationPage = useMemo(() => {
    return (
      pathname?.startsWith("/dashboard/project-location/") &&
      locationID &&
      !programID &&
      !projectID
    );
  }, [pathname, projectID, programID, locationID]);
  console.log("isProjectLocationPage:", isProjectLocationPage);

  // const isProjectsListPage = useMemo(() => {
  //   return (
  //     pathname?.includes("/programs/") &&
  //     pathname?.endsWith("/projects") &&
  //     !projectID &&
  //     !pathname?.startsWith("/field-technician/programs/")
  //   );
  // }, [pathname, projectID]);

  // Field technician route detection
  const isFieldTechnicianProgramsPage = useMemo(() => {
    return (
      pathname?.startsWith("/field-technician/programs") &&
      !programID &&
      !projectID &&
      pathname === "/field-technician/programs"
    );
  }, [pathname, programID, projectID]);

  const isFieldTechnicianProgramProjectsPage = useMemo(() => {
    if (!pathname?.startsWith("/field-technician/programs/")) return false;
    // Path should be like /field-technician/programs/[programID] (without /projects/ or /location/)
    // Check pathname structure first, then verify params match
    const hasProjectsInPath = pathname.includes("/projects/");
    const hasLocationInPath = pathname.includes("/location/");
    if (hasProjectsInPath || hasLocationInPath) return false;
    // Path should match pattern: /field-technician/programs/[programID]
    const pathParts = pathname.split("/").filter(Boolean);
    return (
      pathParts.length === 3 &&
      pathParts[0] === "field-technician" &&
      pathParts[1] === "programs"
    );
  }, [pathname]);

  const isFieldTechnicianProjectLocationsPage = useMemo(() => {
    if (!pathname?.startsWith("/field-technician/programs/")) return false;
    // Path should be like /field-technician/programs/[programID]/projects/[projectID]
    // Check pathname structure first
    const hasProjectsInPath = pathname.includes("/projects/");
    const hasLocationInPath = pathname.includes("/location/");
    if (!hasProjectsInPath || hasLocationInPath) return false;
    // Path should match pattern: /field-technician/programs/[programID]/projects/[projectID]
    const pathParts = pathname.split("/").filter(Boolean);
    return (
      pathParts.length === 5 &&
      pathParts[0] === "field-technician" &&
      pathParts[1] === "programs" &&
      pathParts[3] === "projects"
    );
  }, [pathname]);

  const isFieldTechnicianLocationPage = useMemo(() => {
    if (!pathname?.startsWith("/field-technician/programs/")) return false;
    // Path should match pattern: /field-technician/programs/[programID]/location/[locationID]
    const hasLocationInPath = pathname.includes("/location/");
    if (!hasLocationInPath) return false;
    const pathParts = pathname.split("/").filter(Boolean);
    console.log(pathParts);
    return (
      (pathParts.length === 5 || pathParts.length === 6) &&
      pathParts[0] === "field-technician" &&
      pathParts[1] === "programs" &&
      pathParts[3] === "location"
    );
  }, [pathname]);

  const currentProgram = useMemo(() => {
    if (role === "user" && programID && userPrograms) {
      return userPrograms.find((p) => p.id === programID);
    }
    if (programID && programs) {
      return programs.find((p) => p.id === programID);
    }
    if (locationID && programs && isProjectLocationPage) {
      return getProgramIDProjectLocationID(locationID as string, programs);
    }
    if (projectID && programs && isProjectDetailsPage) {
      // Find program that contains this project
      return programs.find((p) =>
        p.projects?.some((project: ProjectType) => project.id === projectID),
      );
    }
    return undefined;
  }, [
    programID,
    projectID,
    programs,
    locationID,
    userPrograms,
    isProjectLocationPage,
    isProjectDetailsPage,
    role,
  ]);

  return (
    <>
      <MobileNavbar />
      <nav className="bg-primary text-black w-screen flex items-center justify-between h-12 px-2 border-b z-50">
        <div className="flex items-center gap-4 overflow-x-auto">
          <div className="flex items-center justify-between gap-2 min-w-max">
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

            {!programID && !projectID && !locationID ? (
              <span className="text-black whitespace-nowrap">{pageTitle}</span>
            ) : (
              // ADMIN VIEW
              <>
                {role === "admin" ? (
                  <>
                    <ProgramDropdown
                      programID={(programID as string) ?? currentProgram?.id}
                      allPrograms={programs ?? []}
                    />

                    {currentProgram && (
                      <>
                        {/* Show "Projects" link when on projects list page */}
                        {/* {isProjectsListPage && (
                          <>
                            <BreadcrumbSeparator />
                            <Link
                              href={`/dashboard/programs/${currentProgram.id}/projects`}
                              className="text-black whitespace-nowrap"
                            >
                              <span className="w-37.5 flex items-center gap-2">
                                <Box className="h-4 w-4 text-[#707070]" />
                                Projects
                              </span>
                            </Link>
                          </>
                        )} */}

                        {/* Show project name when on project details page */}
                        {isProjectDetailsPage && projectID && (
                          <>
                            <BreadcrumbSeparator />
                            <Link
                              href={`/dashboard/programs/${currentProgram.id}/projects`}
                              className="text-black whitespace-nowrap"
                            >
                              <span className="w-50 flex items-center gap-2">
                                <Box className="h-4 w-4 text-[#707070]" />
                                Project List
                              </span>
                            </Link>
                            <BreadcrumbSeparator />
                            <ProjectDetailsBreadcrumb
                              program={currentProgram}
                              projectID={projectID as string}
                              role={role}
                            />
                          </>
                        )}

                        {/* Show project location when on project location page */}
                        {isProjectLocationPage && locationID && (
                          <>
                            <BreadcrumbSeparator />
                            <Link
                              href={`/dashboard/programs/${currentProgram.id}/projects`}
                              className="text-black whitespace-nowrap"
                            >
                              <span className="w-37.5 flex items-center gap-2">
                                <Box className="h-4 w-4 text-[#707070]" />
                                Project List
                              </span>
                            </Link>
                            <BreadcrumbSeparator />
                            <ProjectLocationDropdown
                              program={currentProgram}
                              locationID={locationID as string}
                              role={role}
                            />
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  // USER VIEW (FIELD TECHNICIAN)
                  <>
                    {/* Field technician programs list page */}
                    {isFieldTechnicianProgramsPage && (
                      <span className="text-black whitespace-nowrap flex items-center gap-2">
                        <Boxes className="h-4 w-4 text-[#707070]" />
                        {pageTitle || "Assigned Programs"}
                      </span>
                    )}

                    {/* Field technician program projects page */}
                    {isFieldTechnicianProgramProjectsPage && (
                      <>
                        <UserProgramsDropdown programID={programID as string} />
                        <BreadcrumbSeparator />
                        <Link
                          href={`/field-technician/programs/${programID}`}
                          className="text-black whitespace-nowrap"
                        >
                          <span className="w-37.5 flex items-center gap-2">
                            <Archive className="h-4 w-4 text-[#707070]" />
                            Project List
                          </span>
                        </Link>
                      </>
                    )}

                    {/* Field technician project locations page */}
                    {isFieldTechnicianProjectLocationsPage && (
                      <>
                        <UserProgramsDropdown programID={programID as string} />
                        <BreadcrumbSeparator />
                        <span className="text-black whitespace-nowrap flex items-center gap-2">
                          <Archive className="h-4 w-4 text-[#707070]" />
                          {pageTitle || "Locations"}
                        </span>
                      </>
                    )}

                    {/* Field technician location dashboard page */}
                    {isFieldTechnicianLocationPage && (
                      <>
                        <UserProgramsDropdown programID={programID as string} />
                        <BreadcrumbSeparator />
                        <UserProjectsDropdown />
                      </>
                    )}

                    {}

                    {/* Fallback for other field technician pages */}
                    {!isFieldTechnicianProgramsPage &&
                      !isFieldTechnicianProgramProjectsPage &&
                      !isFieldTechnicianProjectLocationsPage &&
                      !isFieldTechnicianLocationPage && (
                        <span className="text-black whitespace-nowrap">
                          {pageTitle || "Projects"}
                        </span>
                      )}
                  </>
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
