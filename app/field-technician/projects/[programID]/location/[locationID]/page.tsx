"use client";

import { getUserProjectNavItems } from "@/components/sidebar/navitems";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { ProjectType } from "@/components/types";
import { SelectProgramAndProjectDetailsByProjectIDAction } from "@/app/actions/ProjectAction";
import { useUniversalRealtime } from "@/hooks/use-universal-realtime";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import MonitoringReportsChart from "@/components/custom/charts/monitoring-reports-chart";
import ProjectActivityLogTable from "@/components/custom/dashboard/project-activity-log-table";
import ProjectDashboardItems from "@/components/custom/dashboard/admin/dashboard-summary-items";
import NotFoundPage from "@/app/not-found";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

function ProjectDashboardInfo(data: ProjectType) {
  const locationDetails = data?.project_location?.[0];

  return (
    <>
      <div className="py-5 px-4 flex justify-between items-start cursor-default">
        <div className="flex flex-col gap-1 text-2xl font-medium">
          <span className="font-bold">{data?.project_name ?? "..."}</span>
          <pre className="text-xs italic">{data?.description}</pre>
          <span className="text-md mb-4">
            Location: {locationDetails?.location ?? "NOT SPECIFIED"}
          </span>
          <span className="text-sm text-muted-foreground">
            Date Created:&nbsp;
            {locationDetails?.created_at
              ? format(new Date(locationDetails?.created_at), "PPp")
              : "NOT SPECIFIED"}
          </span>
          <span className="text-sm text-muted-foreground">
            Start Date:&nbsp;
            {locationDetails?.start_date
              ? format(new Date(locationDetails?.start_date), "PP")
              : "NOT SPECIFIED"}
          </span>
          {locationDetails?.end_date && (
            <span className="text-sm text-muted-foreground">
              End Date:&nbsp;
              {format(new Date(locationDetails?.end_date), "PP")}
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            FCA:&nbsp;
            {data.fca?.map((fca) => fca.description).join(", ") ??
              "NO FCA IDENTIFIED YET"}
          </span>
          <span className="text-sm text-muted-foreground">
            Total Alloted Area:
            {locationDetails?.total_alloted_area
              ? ` ${locationDetails?.total_alloted_area} hectares`
              : "NOT SPECIFIED"}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <Badge variant="outline" className={`h-7 px-4 text-xs gap-2`}>
            <span
              className={`w-2 h-2 bg-${
                locationDetails?.status === 1 ? "primary" : "red-500"
              } rounded-full`}
            ></span>
            Project Status
          </Badge>
          <Link
            href={`/field-technician/projects/${data?.program_id}/projects/${data?.id}`}
            prefetch={true}
          >
            <Button variant={"outline"} className="w-full" size="sm">
              <ChevronLeft />
              Back
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default function ProjectDashboard() {
  const { programID, locationID } = useParams();

  const { data, isLoading, error } = useUniversalRealtime({
    queryKey: ["project-dashboard-items", locationID as string],
    queryFn: () =>
      SelectProgramAndProjectDetailsByProjectIDAction(locationID as string),
    tables: ["projects", "farmers", "project_location"],
  });

  if (data === undefined && !isLoading) return <NotFoundPage />;
  if (data === undefined && isLoading) return <></>;
  if (!data) return <NotFoundPage />;

  return (
    <CustomPageLayout
      isLoading={isLoading}
      error={error}
      navItems={getUserProjectNavItems(programID as string, locationID as string)}
      className="m-0 p-0 space-y-4"
      role="user"
    >
      <ProjectDashboardInfo {...data} />
      <Separator />
      <section className="p-4 space-y-4">
        <ProjectDashboardItems />
        <MonitoringReportsChart />
        <ProjectActivityLogTable />
      </section>
    </CustomPageLayout>
  );
}
