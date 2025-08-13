"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

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
import { useSelectAllTravelOrdersByUserIDHook } from "@/components/hooks";

type TravelOrderDropdownProps = {
  form: UseFormReturn<any>;
};
export function TravelOrderDropdown({ form }: TravelOrderDropdownProps) {
  const { data, isLoading } = useSelectAllTravelOrdersByUserIDHook();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <>
      <Label className="mb-1">Travel Order No</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between shadow-xs font-normal"
          >
            {value
              ? `${
                  data?.find((order) => order.id === value)?.travel_order_no
                }: ${data?.find((order) => order.id === value)?.purpose}`
              : "Select travel order..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <Command>
              <CommandInput
                placeholder="Search travel orders..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No travel order found.</CommandEmpty>
                <CommandGroup>
                  {data?.map((order) => (
                    <CommandItem
                      key={order.id}
                      value={order.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        form.setValue("travel_order_no", currentValue);
                        setOpen(false);
                      }}
                    >
                      {order.travel_order_no}: {order.purpose}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === order.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
