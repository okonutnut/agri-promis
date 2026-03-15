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
import { useSelectAllUserProfilesHook } from "@/app/hooks/UserProfileHook";

type UserComboBoxProps = {
  form: UseFormReturn<any>;
};
export function UserComboBox({ form }: UserComboBoxProps) {
  const { data } = useSelectAllUserProfilesHook();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <>
      <Label className="capitalize mb-1 block text-sm font-semibold">
        Issued To:
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
              ? data?.find((user) => user.id === value)?.fullname
              : "Select officer..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput placeholder="Search users..." className="h-9" />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup>
                {data?.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      form.setValue("user_id", currentValue);
                      setOpen(false);
                    }}
                  >
                    {user.fullname}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === user.id ? "opacity-100" : "opacity-0",
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
