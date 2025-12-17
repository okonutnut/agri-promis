


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
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllTravelOrdersByUserIDAction } from "@/app/actions/TravelOrderAction";
import { useSupabaseSession } from "@/hooks/use-session";
import { PostTravelReportFormData } from "../../../app/field-technician/post-travel-reports/components/post-travel-form-schema";
import { TravelOrderType } from "@/components/types";

type TravelOrderDropdownProps = {
  form: UseFormReturn<PostTravelReportFormData>;
  onTravelOrderSelect?: (travelOrderId: string, travelOrder?: TravelOrderType) => void;
};

export function TravelOrderDropdown({ form, onTravelOrderSelect }: TravelOrderDropdownProps) {
  const { data: userData } = useSupabaseSession();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const { data, isLoading } = useRealtimeQuery({
    queryKey: ["travel-orders"],
    queryFn: () => SelectAllTravelOrdersByUserIDAction(userData?.user.id),
    table: "travel_order",
  });

  return (
    <>
      <Label className="capitalize mb-1 block text-sm font-semibold">
        Travel Order No:
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between shadow-xs font-normal"
          >
            {value
              ? `${data?.find((order) => order.id === value)?.travel_order_no}`
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
                        form.setValue("travel_order_id", currentValue);
                        form.setValue("travel_date_id", ""); // Reset travel date
                        const selectedOrder = data?.find((o) => o.id === currentValue);
                        onTravelOrderSelect?.(currentValue, selectedOrder);
                        setOpen(false);
                      }}
                    >
                      Travel Order Number: {order.travel_order_no}
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