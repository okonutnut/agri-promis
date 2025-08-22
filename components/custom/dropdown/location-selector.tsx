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
import { Label } from "@/components/ui/label";

interface LocationSelectorProps {
  onChange?: (location: string) => void;
}

export default function LocationSelector({ onChange }: LocationSelectorProps) {
  const [municipality, setMunicipality] = useState<string>("");
  const [barangay, setBarangay] = useState<string>("");
  const [barangays, setBarangays] = useState<string[]>([]);
  const [openMuni, setOpenMuni] = useState(false);
  const [openBarangay, setOpenBarangay] = useState(false);

  function handleMunicipalityChange(value: string) {
    setMunicipality(value);
    setBarangay(""); // Reset barangay when municipality changes
    const found = muniData.find((m) => m.municipality === value);
    setBarangays(found ? found.barangays : []);
    setOpenMuni(false);
    onChange?.(""); // Pass empty string when municipality changes
  }

  function handleBarangayChange(value: string) {
    setBarangay(value);
    const formatted = `${value}, ${municipality}`;
    setOpenBarangay(false);
    onChange?.(formatted); // Pass the formatted string
  }

  return (
    <div className="flex flex-wrap justify-between gap-2 m-0">
      <div className="space-y-2 w-full">
        <Label htmlFor="municipality">Municipality</Label>
        <Popover open={openMuni} onOpenChange={setOpenMuni}>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              role="combobox"
              aria-expanded={openMuni}
              className="w-full justify-between shadow-xs font-normal"
            >
              {municipality
                ? muniData.find((m) => m.municipality === municipality)
                    ?.municipality
                : "Select municipality..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 ">
            <Command>
              <CommandInput placeholder="Search municipality..." />
              <CommandList>
                <CommandEmpty>No municipality found.</CommandEmpty>
                <CommandGroup>
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
      </div>

      <div className="space-y-2 w-full">
        <Label htmlFor="barangay">Barangay</Label>
        <Popover open={openBarangay} onOpenChange={setOpenBarangay}>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              role="combobox"
              aria-expanded={openBarangay}
              className="w-full justify-between shadow-xs font-normal"
              disabled={!municipality}
            >
              {barangay
                ? barangays.find((b) => b === barangay)
                : "Select barangay..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput placeholder="Search barangay..." />
              <CommandList>
                <CommandEmpty>No barangay found.</CommandEmpty>
                <CommandGroup>
                  {barangays.map((b) => (
                    <CommandItem
                      key={b}
                      value={b}
                      onSelect={() => handleBarangayChange(b)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          barangay === b ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {b}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
