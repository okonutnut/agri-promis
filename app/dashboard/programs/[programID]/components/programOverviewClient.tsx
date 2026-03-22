"use client";

import { useMemo } from "react";
import {
  FolderKanban,
  MapPin,
  CheckCircle,
  Plane,
  FileText,
  Cctv,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectProgramDashboardDataAction } from "@/app/actions/ProgramAction";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import SummaryCard from "@/components/custom/card/summary-cards";

export default function ProgramOverviewClient() {
  const { programID } = useParams();
  const searchParams = useSearchParams();

  // Single optimized query instead of 5 separate queries
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["programDashboardData", programID as string],
    queryFn: () => SelectProgramDashboardDataAction(programID as string),
    table: "programs",
    staleTime: 0,
  });

  const stats = useMemo(() => {
    if (!data)
      return {
        totalProjects: 0,
        totalLocations: 0,
        activeLocations: 0,
        totalPostTravels: 0,
        upcomingPostTravels: 0,
        totalTravelOrders: 0,
        totalMonitoringReports: 0,
        programName: "",
        programDescription: "",
      };

    const {
      program,
      projects,
      travelOrders,
      postTravelReports,
      monitoringReports
    } = data;

    const totalProjects = projects?.length || 0;

    let totalLocations = 0;
    let activeLocations = 0;

    projects?.forEach((project: any) => {
      const locations = project.project_location || [];
      totalLocations += locations.length;
      activeLocations += locations.filter((loc: any) => loc.status === 1).length;
    });

    const filteredTravelOrders = travelOrders || [];
    const now = new Date();
    const totalTravelOrders = filteredTravelOrders.length;
    let upcomingPostTravels = 0;

    filteredTravelOrders.forEach((to: any) => {
      const isActive = to.is_active === 1 ||
                      to.is_active === true ||
                      to.is_active === "1" ||
                      Boolean(to.is_active);

      if (isActive) {
        const hasFutureDeparture = to.departure_date && new Date(to.departure_date) > now;
        const hasFutureReturn = to.return_date && new Date(to.return_date) > now;

        const hasFutureItinerary = to.travel_itinerary?.some(
          (itinerary: { date?: string; end_date?: string }) => {
            const itineraryDate = itinerary.date ? new Date(itinerary.date) : null;
            const itineraryEndDate = itinerary.end_date ? new Date(itinerary.end_date) : null;
            return (
              (itineraryDate && itineraryDate > now) ||
              (itineraryEndDate && itineraryEndDate > now)
            );
          }
        );

        if (hasFutureDeparture || hasFutureReturn || hasFutureItinerary) {
          upcomingPostTravels++;
        }
      }
    });

    const totalPostTravels = postTravelReports?.length || 0;
    const totalMonitoringReports = monitoringReports?.length || 0;

    return {
      totalProjects,
      totalLocations,
      activeLocations,
      totalPostTravels,
      upcomingPostTravels,
      totalTravelOrders,
      totalMonitoringReports,
      programName: program?.program_name || "",
      programDescription: program?.description || "",
    };
  }, [data]);

  return (
    <CustomPageLayout
      pageTitle={
        searchParams?.get("i") && data?.projects
          ? data.projects[Number(searchParams.get("i"))]?.project_name
          : stats.programName || "Program Dashboard"
      }
      pageDescription={
        searchParams?.get("i")
          ? "Project locations and details."
          : stats.programDescription ||
            "Overview of program projects and statistics."
      }
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
        <SummaryCard
          title="Projects"
          description="Total Projects"
          icon={FolderKanban}
          isLoading={isLoading}
        >
          <strong className="text-3xl sm:text-4xl">
            {stats.totalProjects}
          </strong>
        </SummaryCard>
        <SummaryCard
          title="Locations"
          description="Total Project Locations"
          icon={MapPin}
          isLoading={isLoading}
        >
          <strong className="text-3xl sm:text-4xl">
            {stats.totalLocations}
          </strong>
        </SummaryCard>
        <SummaryCard
          title="Active"
          description="Active Locations"
          icon={CheckCircle}
          isLoading={isLoading}
        >
          <strong className="text-3xl sm:text-4xl">
            {stats.activeLocations}
          </strong>
        </SummaryCard>
        <SummaryCard
          title="Travel Orders"
          description="Total Travel Orders Issued"
          icon={FileText}
          isLoading={isLoading}
        >
          <strong className="text-3xl sm:text-4xl">
            {stats.totalTravelOrders}
          </strong>
        </SummaryCard>
        <SummaryCard
          title="Travel Reports"
          description="Total Post Travel Reports"
          icon={Plane}
          isLoading={isLoading}
        >
          <strong className="text-3xl sm:text-4xl">
            {stats.totalPostTravels}
          </strong>
        </SummaryCard>
        <SummaryCard
          title="Monitoring"
          description="Total Monitoring Reports"
          icon={Cctv}
          isLoading={isLoading}
        >
          <strong className="text-3xl sm:text-4xl">
            {stats.totalMonitoringReports}
          </strong>
        </SummaryCard>
      </section>
    </CustomPageLayout>
  );
}
