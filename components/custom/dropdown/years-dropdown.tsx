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
import years from "@/data/years.json";

interface LocationSelectorProps {
  onChange?: (location: string) => void;
}

export default function ProjectYearsDropdown({
  onChange,
}: LocationSelectorProps) {
  // Fetch years from projects created at
  const [year, setYear] = useState<string>("");
  const [openYear, setOpenYear] = useState(false);

  function handleYearChange(value: string) {
    // "All" option clears selection
    const newValue = value === "All" ? "" : year === value ? "" : value;
    setYear(newValue);
    setOpenYear(false);
    onChange?.(newValue);
  }

  return (
    <Popover open={openYear} onOpenChange={setOpenYear}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={openYear}
          className="w-[200px] justify-between shadow-xs font-normal"
        >
          {year ? years.find((m) => m.value === year)?.label : "All Years"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 ">
        <Command>
          <CommandInput placeholder="Filter by year..." />
          <CommandList>
            <CommandEmpty>No years found.</CommandEmpty>
            <CommandGroup>
              <CommandItem value="All" onSelect={() => handleYearChange("All")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    year === "" ? "opacity-100" : "opacity-0"
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
