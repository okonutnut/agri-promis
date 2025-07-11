"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";
import { toast } from "sonner";
import CreateProgramForm from "../custom/forms/create-program-form";
import {
  SelectProgramByIDHook,
  SelectAllProgramsByAgriculturistHook,
} from "../hooks";
import { ProgramType } from "../types";
import { Separator } from "../ui/separator";

type SidebarHeaderItemsProps = {
  programID: string;
};
export default function SidebarHeaderItems({
  programID,
}: SidebarHeaderItemsProps) {
  const router = useRouter();

  const { data: programData, isLoading: isLoadingProgram } =
    SelectProgramByIDHook(programID);

  const { data: allProgramsData, isLoading: isLoadingPrograms } =
    SelectAllProgramsByAgriculturistHook();

  const programs = useMemo(() => {
    return allProgramsData || [];
  }, [allProgramsData]);

  const handleProgramSelect = useCallback(
    (program: ProgramType) => {
      toast.info(`Switched to ${program.program_name}`, {
        position: "bottom-right",
        duration: 2000,
      });
      router.push(`/agriculturist/${program.id}/dashboard`);
    },
    [router]
  );

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="h-10 py-6">
                <div className="text-xs flex flex-col items-start gap-1 font-semibold">
                  {programData?.program_name || "Select Program"}
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-0 w-[var(--radix-popper-anchor-width)]"
              align="start"
            >
              {isLoadingPrograms ? (
                <DropdownMenuItem disabled>
                  <div className="text-w-full text-xs text-center my-auto">
                    Loading programs...
                  </div>
                </DropdownMenuItem>
              ) : programs.length < 1 ? (
                <DropdownMenuItem disabled>
                  <div className="w-full text-xs text-center my-auto">
                    No programs available
                  </div>
                </DropdownMenuItem>
              ) : (
                programs.map((program) => (
                  <DropdownMenuItem
                    key={program.id}
                    onClick={() => handleProgramSelect(program)}
                    className="text-xs py-2 hover:bg-secondary/50"
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="font-semibold">
                        {program.program_name}
                      </span>
                      {program.id === programID && (
                        <span className="w-2 h-2 rounded-full bg-primary inline-block ml-2" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              <Separator className="my-1" />
              <DropdownMenuItem asChild>
                <CreateProgramForm />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
