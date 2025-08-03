"use client";

import * as React from "react";
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
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { useSelectAllProjectsByProgramIDHook } from "@/components/hooks";
import { useParams } from "next/navigation";

type ProjectDropdownProps = {
  form: UseFormReturn<any>;
};
export function ProjectDropdown({ form }: ProjectDropdownProps) {
  const { programID } = useParams();
  const { data } = useSelectAllProjectsByProgramIDHook(programID as string);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <>
      <Label className="mb-1">Project Name</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between shadow-xs font-normal"
          >
            {value
              ? data?.find((project) => project.id === value)?.project_name
              : "Select project..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search projects..." className="h-9" />
            <CommandList>
              <CommandEmpty>No projects found.</CommandEmpty>
              <CommandGroup>
                {data?.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      form.setValue("project_id", currentValue);
                      setOpen(false);
                    }}
                  >
                    {project.project_name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === project.id ? "opacity-100" : "opacity-0"
                      )}
                    />
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
