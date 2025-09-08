"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
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
import { useSelectAllProgramsHook } from "@/components/hooks";
import { useEffect, useMemo, useState } from "react";

type FilterByProgramProps = {
  programID: (id: string) => void;
};

export function FilterByProgram({ programID }: FilterByProgramProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("all");

  const { data: programList, isLoading } = useSelectAllProgramsHook();

  useEffect(() => {
    programID(value);
  }, [value, programID]);

  const programs = useMemo(
    () => [
      { value: "all", label: "All" },
      ...(programList?.map((p) => ({
        value: p.id,
        label: p.program_name as string,
      })) ?? []),
    ],
    [programList]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isLoading}
          className="min-w-1/8 max-w-xs justify-between"
        >
          {isLoading
            ? "Loading..."
            : programs.find((p) => p.value === value)?.label ||
              "Sort by Program"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[250px] m-1" align="start">
        <Command>
          <CommandInput placeholder="Search program..." />
          <CommandList>
            <CommandEmpty>No program found.</CommandEmpty>
            <CommandGroup>
              {programs.map((program) => (
                <CommandItem
                  key={program.value}
                  value={program.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === program.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {program.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
