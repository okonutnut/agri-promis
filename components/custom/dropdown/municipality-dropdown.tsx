"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import muniData from "@/data/locations.json";
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

interface LocationSelectorProps {
  onChange?: (location: string) => void;
}

export default function MunicipalitySelector({
  onChange,
}: LocationSelectorProps) {
  const [municipality, setMunicipality] = useState<string>("");
  const [openMuni, setOpenMuni] = useState(false);

  function handleMunicipalityChange(value: string) {
    // "All" option clears selection
    const newValue = value === "All" ? "" : municipality === value ? "" : value;
    setMunicipality(newValue);
    setOpenMuni(false);
    onChange?.(newValue);
  }

  return (
    <Popover open={openMuni} onOpenChange={setOpenMuni}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={openMuni}
          className="w-[200px] justify-between shadow-xs font-normal"
        >
          {municipality
            ? muniData.find((m) => m.municipality === municipality)
                ?.municipality
            : "All Municipalities"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 ">
        <Command>
          <CommandInput placeholder="Search municipality..." />
          <CommandList>
            <CommandEmpty>No municipality found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="All"
                onSelect={() => handleMunicipalityChange("All")}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    municipality === "" ? "opacity-100" : "opacity-0"
                  )}
                />
                All
              </CommandItem>
              {muniData.map((m) => (
                <CommandItem
                  key={m.municipality}
                  value={m.municipality}
                  onSelect={() => handleMunicipalityChange(m.municipality)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      municipality === m.municipality
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {m.municipality}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
