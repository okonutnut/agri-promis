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
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllTravelOrdersByUserIDAction } from "@/app/actions/TravelOrderAction";
import { useSupabaseSession } from "@/hooks/use-session";
import { TravelOrderProjectsType } from "@/components/types";
import { PostTravelReportFormData } from "../../../app/field-technician/post-travel-reports/components/post-travel-form-schema";

type TravelDateDropdownProps = {
  form: UseFormReturn<PostTravelReportFormData>;
  travelOrderId: string | null;
};

export function TravelDateDropdown({ form, travelOrderId }: TravelDateDropdownProps) {
  const { data: userData } = useSupabaseSession();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const { data: travelOrders } = useRealtimeQuery({
    queryKey: ["travel-orders"],
    queryFn: () => SelectAllTravelOrdersByUserIDAction(userData?.user.id),
    table: "travel_order",
  });

  const selectedTravelOrder = travelOrders?.find(
    (order) => order.id === travelOrderId
  );
  const itineraryItems = selectedTravelOrder?.travel_itinerary || [];

  return (
    <>
      <Label className="capitalize mb-1 block text-sm font-semibold">
        Travel Date:
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between shadow-xs font-normal"
            disabled={!travelOrderId || itineraryItems.length === 0}
          >
            {value
              ? (() => {
                  const item = itineraryItems.find((item: TravelOrderProjectsType) => item.id === value);
                  if (!item) return "Select travel date...";
                  const dateStr = item.end_date && item.end_date !== item.date 
                    ? `${item.date} to ${item.end_date}` 
                    : item.date;
                  return `${dateStr} - ${item.destination}`;
                })()
              : travelOrderId
              ? "Select travel date..."
              : "Select travel order first"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search dates..." className="h-9" />
            <CommandList>
              <CommandEmpty>No travel date found.</CommandEmpty>
              <CommandGroup>
                {itineraryItems.map((item: TravelOrderProjectsType) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      form.setValue("travel_date_id", currentValue);
                      setOpen(false);
                    }}
                  >
                    {item.date}{item.end_date && item.end_date !== item.date ? ` to ${item.end_date}` : ""} - {item.destination}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.id ? "opacity-100" : "opacity-0"
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