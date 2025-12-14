"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllProgramsAction } from "@/app/actions/ProgramAction";
import { ProgramType } from "@/components/types";
import { Label } from "@/components/ui/label";

interface ProgramDropdownProps {
  onChange?: (program: string) => void;
}

export default function ProgramDropdown({ onChange }: ProgramDropdownProps) {
  const [program, setProgram] = useState<string>("");
  const [openProgram, setOpenProgram] = useState(false);

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["programs"],
    queryFn: async () => SelectAllProgramsAction(),
    table: "programs",
  });

  console.log("Programs data:", data);

  function handleProgramChange(value: string) {
    const newValue = program === value ? "" : value;
    setProgram(newValue);
    setOpenProgram(false);
    onChange?.(newValue);
  }

  return (
    <>
      <Label className="capitalize mb-1 block text-sm font-semibold">
        Banner Program:
      </Label>
      <Popover open={openProgram} onOpenChange={setOpenProgram}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            aria-expanded={openProgram}
            disabled={isLoading || !!error}
            className="w-full justify-between shadow-xs font-normal"
          >
            {program
              ? data?.find((p) => p.id === program)?.program_name
              : "Select a Program"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search program..." />
            <CommandList>
              <CommandEmpty>No program found.</CommandEmpty>
              <CommandGroup>
                {data?.map((p: ProgramType) => (
                  <CommandItem
                    key={p.id}
                    value={p.id}
                    onSelect={() => handleProgramChange(p.id as string)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        program === p.program_name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {p.program_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
