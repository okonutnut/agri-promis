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
import {
  fetchProgramById,
  fetchProgramsByAgriculturist,
} from "@/app/actions/programs";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import CreateDialog from "./create-dialog";
import CreateProgramForm from "../custom/forms/create-program-form";

interface Program {
  id: string;
  program_name: string;
}

interface SidebarHeaderItemsProps {
  programUID: string;
}
export default function SidebarHeaderItems({
  programUID,
}: SidebarHeaderItemsProps) {
  const router = useRouter();

  const { data: allProgramsData, isLoading: isLoadingPrograms } = useQuery({
    queryKey: ["programsByAgriculturist"],
    queryFn: fetchProgramsByAgriculturist,
  });

  const { data: programData, isLoading: isLoadingProgram } = useQuery({
    queryKey: ["programData", programUID],
    queryFn: () => fetchProgramById(programUID),
    enabled: !!programUID,
  });

  // Derive selected program from query data instead of using state
  const selectedProgram = useMemo(() => {
    return programData?.data || null;
  }, [programData?.data]);

  const programs = useMemo(() => {
    return allProgramsData?.data || [];
  }, [allProgramsData?.data]);

  const handleProgramSelect = useCallback(
    (program: Program) => {
      toast(`Switched to ${program.program_name}`, {
        position: "bottom-right",
      });
      router.push(`/agriculturist/${program.id}/dashboard`);
    },
    [router]
  );

  const displayText = useMemo(() => {
    if (isLoadingProgram && programUID) return "Loading...";
    return selectedProgram?.program_name || "Select Program";
  }, [selectedProgram?.program_name, isLoadingProgram, programUID]);

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="h-10 py-6">
                <div className="text-xs flex flex-col items-start gap-1 font-semibold">
                  {displayText}
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
                  <div className="text-xs">Loading programs...</div>
                </DropdownMenuItem>
              ) : programs.length === 0 ? (
                <DropdownMenuItem disabled>
                  <div className="text-xs">No programs available</div>
                </DropdownMenuItem>
              ) : (
                programs.map((program: Program) => (
                  <DropdownMenuItem
                    key={program.id}
                    className="w-full cursor-pointer"
                    onClick={() => handleProgramSelect(program)}
                  >
                    <div className="text-xs flex flex-col items-start gap-1 font-semibold">
                      {program.program_name}
                    </div>
                    <div
                      className={`ml-auto w-2 h-2 rounded-full ${
                        selectedProgram?.id === program.id
                          ? "bg-primary"
                          : "border border-slate-600"
                      }`}
                    />
                  </DropdownMenuItem>
                ))
              )}
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
