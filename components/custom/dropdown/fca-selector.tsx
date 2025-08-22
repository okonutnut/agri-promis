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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useSelectAllFCAByStatusHook } from "@/components/hooks";

interface FCASelectorProps {
  onChange?: (fcas: string[]) => void;
  value?: string[];
  defaultValue?: string[]; // Add defaultValue prop
}

export default function FCASelector({
  onChange,
  value = [],
  defaultValue = [], // Add defaultValue with empty array as default
}: FCASelectorProps) {
  const { data: fcas } = useSelectAllFCAByStatusHook(1);
  const [selectedFCAs, setSelectedFCAs] = useState<string[]>(
    value.length > 0 ? value : defaultValue
  );
  const [open, setOpen] = useState(false);

  // Sync internal state with value prop changes
  useEffect(() => {
    if (value.length > 0) {
      setSelectedFCAs(value);
    } else if (defaultValue.length > 0 && selectedFCAs.length === 0) {
      setSelectedFCAs(defaultValue);
      onChange?.(defaultValue); // Call onChange with default value
    }
  }, [value, defaultValue, onChange, selectedFCAs.length]);

  function handleFCAToggle(fcaId: string) {
    const newSelection = selectedFCAs.includes(fcaId)
      ? selectedFCAs.filter((id) => id !== fcaId)
      : [...selectedFCAs, fcaId];

    setSelectedFCAs(newSelection);
    onChange?.(newSelection);
  }

  function clearAll() {
    setSelectedFCAs([]);
    onChange?.([]);
  }

  const getSelectedFCANames = () => {
    if (!fcas || selectedFCAs.length === 0) return [];
    return selectedFCAs
      .map((id) => fcas.find((f) => f.id === id)?.description)
      .filter(Boolean);
  };

  return (
    <div className="space-y-2 w-full">
      <Label>Farmers&apos; Cooperatives and Associations</Label>

      {/* Selected FCAs Display */}
      {selectedFCAs.length > 0 && (
        <div className="flex flex-wrap gap-1 p-2 border rounded-md">
          {getSelectedFCANames().map((name, index) => (
            <Badge
              key={selectedFCAs[index]}
              variant="outline"
              className="text-xs"
            >
              {name}
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
            onClick={clearAll}
          >
            Clear all
          </Button>
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between shadow-xs font-normal"
          >
            {selectedFCAs.length === 0
              ? "Select FCAs..."
              : `${selectedFCAs.length} FCA${
                  selectedFCAs.length > 1 ? "s" : ""
                } selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search FCAs..." />
            <CommandList>
              <CommandEmpty>No FCA found.</CommandEmpty>
              <CommandGroup>
                {fcas &&
                  fcas.map((fca) => (
                    <CommandItem
                      key={fca.id}
                      value={fca.description}
                      onSelect={() => fca.id && handleFCAToggle(fca.id)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selectedFCAs.includes(fca.id || "")
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      {fca.description}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
