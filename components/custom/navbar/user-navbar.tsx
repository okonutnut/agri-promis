"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Slash, ChevronsUpDown, Box, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useSelectAssignedProjectsByFieldTechnicianHook } from "@/components/hooks";
import { ProjectType } from "@/components/types";
import Link from "next/link";
import NavbarUserImage from "./navbar-user-image";
import { Skeleton } from "@/components/ui/skeleton";
import MobileNavbar from "./mobile-nav";
import AppDrawer from "@/components/sidebar/appDrawer";
import { getFieldTechnicianNavItems } from "@/components/sidebar/navitems";
import { Separator } from "@/components/ui/separator";

// Constants
const PATHS = {
  FIELD_TECHNICIAN: "/field-technician",
} as const;

// Types
type NavbarProps = {
  noSidebar?: boolean;
};

type ProjectDropdownProps = {
  projectID: string;
  projects: ProjectType[] | undefined;
};

// Reusable components
const BreadcrumbSeparator = () => (
  <span className="text-gray-400">
    <Slash className="h-3 w-3 mx-1" />
  </span>
);

const ProjectDropdown = ({ projectID, projects }: ProjectDropdownProps) => {
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

export default function UserNavbar({ noSidebar }: NavbarProps) {
  const { projectID } = useParams();
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
                sidebarOptions={getFieldTechnicianNavItems(projectID as string)}
                trigger={
                  <Button variant="ghost" className="md:hidden sm:hidden">
                    <AlignLeft />
                  </Button>
                }
              />
            )}

            <BreadcrumbSeparator />

            {projectID ? (
              <ProjectDropdown
                projectID={projectID as string}
                projects={projects}
              />
            ) : (
              <Link
                href={PATHS.FIELD_TECHNICIAN}
                className="text-black whitespace-nowrap"
              >
                Dashboard
              </Link>
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
