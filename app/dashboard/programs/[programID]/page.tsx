"use client";

import { useMemo, useState } from "react";
import {
  FolderKanban,
  MapPin,
  CheckCircle,
  Plane,
  Calendar,
  FileText,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllProjectsByProgramIDAction } from "@/app/actions/ProjectAction";
import { SelectProgramByIdAction } from "@/app/actions/ProgramAction";
import { SelectAllTravelOrdersByProgramIDAction } from "@/app/actions/TravelOrderAction";
import { SelectAllPostTravelReportsByProgramIDAction } from "@/app/actions/PostTravelAction";
import { Button } from "@/components/ui/button";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import SummaryCard from "@/components/custom/card/summary-cards";
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
import { cn } from "@/lib/utils";
import years from "@/data/years.json";

// Year selector component with "All" option
function YearSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const yearOptions = [
    { label: "All", value: "all" },
    ...years.map((y) => ({ label: y.label.toString(), value: y.value })),
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between shadow-xs font-normal"
        >
          {value === "all"
            ? "All Years"
            : `Year ${yearOptions.find((y) => y.value === value)?.label || value}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder="Search year..." />
          <CommandList>
            <CommandEmpty>No year found.</CommandEmpty>
            <CommandGroup>
              {yearOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function ProgramOverviewPage() {
  const { programID } = useParams();
  const searchParams = useSearchParams();

  // Year filter state - default to current year
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    // Check if current year exists in years data, otherwise default to "all"
    const yearExists = years.some((y) => y.value === currentYear);
    return yearExists ? currentYear : "all";
  });

  const { data: programData, isLoading: programLoading } = useRealtimeQuery({
    queryKey: ["programDetails", programID as string],
    queryFn: () => SelectProgramByIdAction(programID as string),
    table: "programs",
  });

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["allProjectsByProgramId", programID as string],
    queryFn: () => {
      return SelectAllProjectsByProgramIDAction(programID as string);
    },
    table: "projects",
  });

  const { data: travelOrders, isLoading: travelOrdersLoading } = useRealtimeQuery({
    queryKey: ["travelOrdersByProgramId", programID as string],
    queryFn: () => SelectAllTravelOrdersByProgramIDAction(programID as string),
    table: "travel_order",
  });

  const { data: postTravelReports, isLoading: postTravelLoading } = useRealtimeQuery({
    queryKey: ["postTravelReportsByProgramId", programID as string],
    queryFn: () => SelectAllPostTravelReportsByProgramIDAction(programID as string),
    table: "post_travel",
  });

  // Helper function to check if a date falls within the selected year
  const isInSelectedYear = (dateString: string | undefined | null): boolean => {
    if (!dateString) return false;
    if (selectedYear === "all") return true;
    const date = new Date(dateString);
    return date.getFullYear().toString() === selectedYear;
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data) return { 
      totalProjects: 0, 
      totalLocations: 0, 
      activeLocations: 0,
      totalPostTravels: 0,
      upcomingPostTravels: 0,
      totalTravelOrders: 0,
    };
    
    // Filter projects by year - a project is included if it has locations created in that year
    // or if the project itself was created in that year
    const filteredProjects = selectedYear === "all" 
      ? data 
      : data.filter((project) => {
          // Include project if it was created in the selected year
          if (isInSelectedYear(project.created_at)) return true;
          
          // Include project if it has any location created in the selected year
          const hasLocationInYear = project.project_location?.some((loc) => 
            isInSelectedYear(loc.created_at)
          );
          return hasLocationInYear || false;
        });
    
    const totalProjects = data.length;
    
    // Filter locations by year (based on created_at)
    const filteredLocations = filteredProjects.flatMap((project) => 
      project.project_location?.filter((loc) => 
        selectedYear === "all" || isInSelectedYear(loc.created_at)
      ) || []
    );
    
    const totalLocations = filteredLocations.length;
    const activeLocations = filteredLocations.filter((loc) => loc.status === 1).length;

    // Calculate travel order statistics
    // Filter travel orders by year (based on created_at or departure_date)
    const filteredTravelOrders = travelOrders?.filter((to) => {
      if (selectedYear === "all") return true;
      return (
        isInSelectedYear(to.created_at) ||
        isInSelectedYear(to.departure_date) ||
        isInSelectedYear(to.return_date)
      );
    }) || [];
    
    // Filter active travel orders
    const activeTravelOrders = filteredTravelOrders.filter((to) => {
      const isActive = to.is_active;
      return isActive === 1 || isActive === true || isActive === "1" || Boolean(isActive);
    });
    
    // Filter post travel reports by year (based on created_at)
    const filteredPostTravelReports = postTravelReports?.filter((ptr) => {
      if (selectedYear === "all") return true;
      return isInSelectedYear(ptr.created_at);
    }) || [];
    
    const totalPostTravels = filteredPostTravelReports.length;

    const now = new Date();
    const upcomingPostTravels = activeTravelOrders.filter((to) => {
      // Check if travel order has future dates (upcoming travel)
      const hasFutureDeparture = 
        to.departure_date && new Date(to.departure_date) > now;
      const hasFutureReturn = 
        to.return_date && new Date(to.return_date) > now;
      
      // Also check travel itinerary items for future dates
      const hasFutureItinerary = to.travel_itinerary?.some((itinerary: { date?: string; end_date?: string }) => {
        const itineraryDate = itinerary.date ? new Date(itinerary.date) : null;
        const itineraryEndDate = itinerary.end_date ? new Date(itinerary.end_date) : null;
        return (
          (itineraryDate && itineraryDate > now) ||
          (itineraryEndDate && itineraryEndDate > now)
        );
      });

      return hasFutureDeparture || hasFutureReturn || hasFutureItinerary;
    }).length;

    // Total travel orders issued - count filtered travel orders
    const totalTravelOrders = filteredTravelOrders.length;

    return { 
      totalProjects, 
      totalLocations, 
      activeLocations,
      totalPostTravels,
      upcomingPostTravels,
      totalTravelOrders,
    };
  }, [data, travelOrders, postTravelReports, selectedYear]);

  return (
    <CustomPageLayout
      pageTitle={
        searchParams?.get("i") && data
          ? data[Number(searchParams.get("i"))]?.project_name
          : programData?.program_name || "Program Dashboard"
      }
      pageDescription={
        searchParams?.get("i")
          ? "Project locations and details."
          : programData?.description || "Overview of program projects and statistics."
      }
      isLoading={isLoading || programLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
          <div className="mb-4 flex justify-end items-center gap-2">
            <YearSelector value={selectedYear} onChange={setSelectedYear} />
          </div>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
            <SummaryCard
              title="Projects"
              description="Total Projects"
              icon={FolderKanban}
              isLoading={isLoading}
            >
              <strong className="text-3xl sm:text-4xl">{stats.totalProjects}</strong>
            </SummaryCard>
            <SummaryCard
              title="Locations"
              description="Total Project Locations"
              icon={MapPin}
              isLoading={isLoading}
            >
              <strong className="text-3xl sm:text-4xl">{stats.totalLocations}</strong>
            </SummaryCard>
            <SummaryCard
              title="Active"
              description="Active Locations"
              icon={CheckCircle}
              isLoading={isLoading}
            >
              <strong className="text-3xl sm:text-4xl">{stats.activeLocations}</strong>
            </SummaryCard>
            <SummaryCard
              title="Travel Orders"
              description="Total Travel Orders Issued"
              icon={FileText}
              isLoading={isLoading || travelOrdersLoading}
            >
              <strong className="text-3xl sm:text-4xl">{stats.totalTravelOrders}</strong>
            </SummaryCard>
            <SummaryCard
              title="Post Travels"
              description="Total Post Travel Reports"
              icon={Plane}
              isLoading={isLoading || travelOrdersLoading || postTravelLoading}
            >
              <strong className="text-3xl sm:text-4xl">{stats.totalPostTravels}</strong>
            </SummaryCard>
            <SummaryCard
              title="Upcoming"
              description="Upcoming Post Travels"
              icon={Calendar}
              isLoading={isLoading || travelOrdersLoading || postTravelLoading}
            >
              <strong className="text-3xl sm:text-4xl">{stats.upcomingPostTravels}</strong>
            </SummaryCard>
          </section>
    </CustomPageLayout>
  );
}
