"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronsUpDown, Check, ChevronRight, MapPin, Box } from "lucide-react";

type ItemType = {
  id: string;
  location: string;
  projects: { project_name: string };
};

type ReusableProjectsDropdownProps = {
  data?: ItemType[];
  currentId?: string;
  routePrefix: string;
};

export default function ReusableProjectsDropdown({
  data,
  currentId,
  routePrefix,
}: ReusableProjectsDropdownProps) {
  const router = useRouter();
  const currentItem = data?.find((p) => p.id === currentId);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(currentId);

  useEffect(() => {
    setValue(currentId);
  }, [currentId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2 min-w-max">
        <Box className="h-4 w-4 text-[#707070]" />
        <div className="min-w-[150px] truncate">
          {currentItem ? (
            <span className="flex items-center gap-2">
              {currentItem.projects.project_name}
              <ChevronRight className="mx-1 h-3 w-3 text-gray-400" />
              <MapPin className="h-4 w-4 text-[#707070] mr-1" />
              <small>{currentItem.location}</small>
            </span>
          ) : (
            <Skeleton className="w-full h-5" />
          )}
        </div>
      </div>

      <PopoverTrigger asChild>
        <Button className="ml-2 h-7 w-4 text-[#707070]" variant="ghost">
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="m-1 p-0 w-[300px]">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              {(data ?? []).map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(val) => {
                    setValue(val);
                    setOpen(false);
                    router.push(`${routePrefix}/${val}`);
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">
                      {item.projects.project_name}
                    </span>
                    <small className="flex items-center">
                      <MapPin className="h-4 w-4 text-[#707070] mr-1" />
                      {item.location}
                    </small>
                  </div>
                  {item.id === value && <Check className="ml-2 h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <Separator />
        <Link href={`${routePrefix}`} prefetch>
          <CommandItem>All Projects</CommandItem>
        </Link>
      </PopoverContent>
    </Popover>
  );
}
