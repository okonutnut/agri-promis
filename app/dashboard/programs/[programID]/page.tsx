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
import { SelectAllProjectsByProgramIDAction } from "@/app/actions/ProjectAction";
import { SelectProgramByIdAction } from "@/app/actions/ProgramAction";
import { SelectAllTravelOrdersByProgramIDAction } from "@/app/actions/TravelOrderAction";
import { SelectAllPostTravelReportsByProgramIDAction } from "@/app/actions/PostTravelAction";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import SummaryCard from "@/components/custom/card/summary-cards";
import { SelectAllMonitoringReportsByProgramIDAction } from "@/app/actions/MonitoringAction";

export default function ProgramOverviewPage() {
  const { programID } = useParams();
  const searchParams = useSearchParams();

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

  const { data: monitoringData, isLoading: monitoringLoading } =
    useRealtimeQuery({
      queryKey: ["allMonitoringReports", programID as string],
      queryFn: () => {
        return SelectAllMonitoringReportsByProgramIDAction(programID as string);
      },
      table: "monitoring",
    });

  const { data: travelOrders, isLoading: travelOrdersLoading } =
    useRealtimeQuery({
      queryKey: ["travelOrdersByProgramId", programID as string],
      queryFn: () =>
        SelectAllTravelOrdersByProgramIDAction(programID as string),
      table: "travel_order",
    });

  const { data: postTravelReports, isLoading: postTravelLoading } =
    useRealtimeQuery({
      queryKey: ["postTravelReportsByProgramId", programID as string],
      queryFn: () =>
        SelectAllPostTravelReportsByProgramIDAction(programID as string),
      table: "post_travel",
    });

  // Optimize: Calculate all statistics in a single pass to avoid multiple iterations
  const stats = useMemo(() => {
    if (!data)
      return {
        totalProjects: 0,
        totalLocations: 0,
        activeLocations: 0,
        totalPostTravels: 0,
        upcomingPostTravels: 0,
        totalTravelOrders: 0,
      };

    const totalProjects = data.length;

    // Calculate locations in a single pass
    let totalLocations = 0;
    let activeLocations = 0;
    data.forEach((project) => {
      const locations = project.project_location || [];
      totalLocations += locations.length;
      activeLocations += locations.filter((loc) => loc.status === 1).length;
    });

    // Calculate travel order statistics in a single pass
    const filteredTravelOrders = travelOrders || [];
    const now = new Date();
    const totalTravelOrders = filteredTravelOrders.length;
    let upcomingPostTravels = 0;

    filteredTravelOrders.forEach((to) => {
      // Check if travel order is active and has upcoming dates
      const isActive =
        to.is_active === 1 ||
        to.is_active === true ||
        to.is_active === "1" ||
        Boolean(to.is_active);

      if (isActive) {
        // Check if travel order has future dates (upcoming travel)
        const hasFutureDeparture =
          to.departure_date && new Date(to.departure_date) > now;
        const hasFutureReturn =
          to.return_date && new Date(to.return_date) > now;

        // Also check travel itinerary items for future dates
        const hasFutureItinerary = to.travel_itinerary?.some(
          (itinerary: { date?: string; end_date?: string }) => {
            const itineraryDate = itinerary.date
              ? new Date(itinerary.date)
              : null;
            const itineraryEndDate = itinerary.end_date
              ? new Date(itinerary.end_date)
              : null;
            return (
              (itineraryDate && itineraryDate > now) ||
              (itineraryEndDate && itineraryEndDate > now)
            );
          },
        );

        if (hasFutureDeparture || hasFutureReturn || hasFutureItinerary) {
          upcomingPostTravels++;
        }
      }
    });

    const totalPostTravels = postTravelReports?.length || 0;
    const totalMonitoringReports = monitoringData?.length || 0;

    return {
      totalProjects,
      totalLocations,
      activeLocations,
      totalPostTravels,
      upcomingPostTravels,
      totalTravelOrders,
      totalMonitoringReports,
    };
  }, [data, travelOrders, postTravelReports, monitoringData]);

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
          : programData?.description ||
            "Overview of program projects and statistics."
      }
      isLoading={isLoading || programLoading}
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
          isLoading={travelOrdersLoading}
        >
          <strong className="text-3xl sm:text-4xl">
            {stats.totalTravelOrders}
          </strong>
        </SummaryCard>
        <SummaryCard
          title="Travel Reports"
          description="Total Post Travel Reports"
          icon={Plane}
          isLoading={postTravelLoading}
        >
          <strong className="text-3xl sm:text-4xl">
            {stats.totalPostTravels}
          </strong>
        </SummaryCard>
        <SummaryCard
          title="Monitoring"
          description="Total Monitoring Reports"
          icon={Cctv}
          isLoading={monitoringLoading}
        >
          <strong className="text-3xl sm:text-4xl">
            {stats.totalMonitoringReports}
          </strong>
        </SummaryCard>
      </section>
    </CustomPageLayout>
  );
}
