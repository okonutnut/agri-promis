"use client";

import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Boxes, Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, usePathname } from "next/navigation";
import {
  useSelectAllProgramsByAgriculturistHook,
  useSelectProgramAndProjectDetailsByProgjectIDHook,
} from "@/components/hooks";
import { ProgramType } from "@/components/types";
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
  console.log("Program Projects Data:", programProjectsData);

  return (
    <nav className="w-full flex items-center justify-between h-12 px-4 bg-white border-b border-gray-200 overflow-x-auto z-50">
      <Breadcrumb>
        <BreadcrumbList className="overflow-x-auto flex items-center">
          <BreadcrumbItem>
            <Image
              src={"/logo.png"}
              alt="Logo"
              width={50}
              height={50}
              className="h-8 w-8"
            />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {programID || projectID ? (
            <>
              <BreadcrumbItem className="min-w-[200px]">
                <DropdownMenu>
                  <Link
                    href={`/dashboard/programs/${
                      programID ?? programProjectsData?.program_id
                    }`}
                    className="text-black flex items-center gap-2 text-sm font-medium cursor-pointer"
                  >
                    <Boxes className="mr-1 h-4 w-4" />
                    {programData?.program_name ??
                      programProjectsData?.programs.program_name ??
                      "Loading..."}
                  </Link>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-auto h-7 w-4" variant="ghost">
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
              </BreadcrumbItem>
              {projectID && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbPage>
                    <BreadcrumbLink
                      href={`/dashboard/projects/${programProjectsData?.id}`}
                    >
                      {programProjectsData?.project_name ?? "Loading..."}
                    </BreadcrumbLink>
                  </BreadcrumbPage>
                </>
              )}
            </>
          ) : currentPath === "/dashboard/new" ? (
            <BreadcrumbItem className="text-black">New Program</BreadcrumbItem>
          ) : (
            <BreadcrumbItem>
              <Link href="/dashboard/programs" className="text-black">
                Programs
              </Link>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <NavbarUserImage />
    </nav>
  );
}
