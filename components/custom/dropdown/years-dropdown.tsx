"use client";

import { useState, useEffect } from "react";
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
import years from "@/data/years.json";

interface LocationSelectorProps {
  onChange?: (location: string) => void;
}

export default function ProjectYearsDropdown({
  onChange,
}: LocationSelectorProps) {
  // Default to "all"
  const defaultYear = "all";
  const [year, setYear] = useState<string>(defaultYear);
  const [openYear, setOpenYear] = useState(false);

  // Call onChange with default year on mount to initialize parent state
  useEffect(() => {
    onChange?.(defaultYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  function handleYearChange(value: string) {
    setYear(value);
    setOpenYear(false);
    onChange?.(value);
  }

  const displayText =
    year === "all"
      ? "All Years"
      : "Year " + (years.find((m) => m.value === year)?.label || year);

  return (
    <Popover open={openYear} onOpenChange={setOpenYear}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={openYear}
          className="w-[200px] justify-between shadow-xs font-normal"
        >
          {displayText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 ">
        <Command>
          <CommandInput placeholder="Filter by year..." />
          <CommandList>
            <CommandEmpty>No years found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="all"
                value="all"
                onSelect={() => handleYearChange("all")}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    year === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                All
              </CommandItem>
              {years.map((m) => (
                <CommandItem
                  key={m.value}
                  value={m.value}
                  onSelect={() => handleYearChange(m.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      year === m.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {m.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
