import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Boxes, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import {
  useSelectAllProgramsByAgriculturistHook,
  useSelectProgramByIDHook,
} from "@/components/hooks";
import { ProgramType } from "@/components/types";
import Link from "next/link";
import NavbarUserImage from "./navbar-user-image";

export default function Navbar() {
  const { programID, projectID } = useParams();
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const { data: programData } = useSelectProgramByIDHook(programID as string);
  const { data: allProgramsData } = useSelectAllProgramsByAgriculturistHook();
  return (
    <nav className="flex items-center justify-between h-12 px-4 bg-white border-b border-gray-200 overflow-x-auto z-50">
      <Breadcrumb className="min-w-[500px]">
        <BreadcrumbList>
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
              <BreadcrumbItem className="min-w-[170px]">
                <DropdownMenu>
                  <Link
                    href={`/dashboard/programs/${programID}`}
                    className="text-black flex items-center gap-2 text-sm font-medium cursor-pointer"
                  >
                    <Boxes className="mr-1 h-4 w-4" />
                    {programData?.program_name ?? "Loading..."}
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
                            <span className="text-green-600 text-xs font-semibold ml-2 uppercase">
                              Current
                            </span>
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
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/components">
                      Components
                    </BreadcrumbLink>
                  </BreadcrumbItem>
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
