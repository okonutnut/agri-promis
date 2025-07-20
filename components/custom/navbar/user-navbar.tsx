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

type NavbarProps = {
  noSidebar?: boolean;
};
export default function UserNavbar({ noSidebar }: NavbarProps) {
  const { projectID } = useParams();

  // Project Data
  const { data } = useSelectAssignedProjectsByFieldTechnicianHook();

  return (
    <>
      <MobileNavbar />
      <nav className="w-full flex items-center justify-between min-h-12 px-2 border-b z-50">
        <div className="flex items-center gap-4 overflow-x-auto overflow-y-hidden w-full">
          <div className="flex items-center gap-2 min-w-max">
            <span className="hidden sm:inline">
              <Image
                src={"/logo.png"}
                alt="Logo"
                width={50}
                height={50}
                className="h-8 w-8 flex-shrink-0 text-[#707070]"
              />
            </span>
            {!noSidebar && (
              <AppDrawer
                options={getFieldTechnicianNavItems(projectID as string)}
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
            {projectID ? (
              <DropdownMenu>
                <Link
                  href={`/field-technician`}
                  className="text-black  whitespace-nowrap flex items-center gap-2 h-full"
                >
                  <Box className="h-4 w-4 flex-shrink-0 text-[#707070]" />
                  <span className="min-w-[150px] truncate inline-block">
                    {data?.find((d) => d.id === projectID)?.project_name ?? (
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
                  {data?.map((project: ProjectType) => (
                    <Link
                      key={project.id}
                      href={`/dashboard/projects/${project.id}`}
                    >
                      <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
                        {project?.project_name ?? (
                          <Skeleton className="w-full h-5" />
                        )}
                        {project.id === projectID && (
                          <Check className="ml-2 h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                  <Link href={`/field-technician/`}>
                    <DropdownMenuItem className="justify-between w-full h-7 cursor-pointer hover:bg-gray-100">
                      All Projects
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={`/field-technician`}>Dashboard</Link>
            )}
          </div>
        </div>
        <span className="hidden sm:inline">
          <NavbarUserImage />
        </span>
      </nav>
    </>
  );
}
