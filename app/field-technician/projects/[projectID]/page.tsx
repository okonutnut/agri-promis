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

function ProjectDashboardInfo(data: ProjectType) {
  return (
    <div className="py-6 px-4 flex justify-between items-start cursor-default">
      <div className="flex flex-col gap-1 text-2xl font-medium ">
        {data?.project_name ?? "..."}
        <br />
        <pre className="text-xs italic">{data?.description}</pre>
        <span className="text-sm text-muted-foreground mt-4">
          Date Created:&nbsp;
          {data?.created_at
            ? format(new Date(data.created_at), "PPp")
            : "NOT SPECIFIED"}
        </span>
        <span className="text-sm text-muted-foreground">
          Start Date:{" "}
          {data?.project_location?.[0]?.start_date
            ? format(new Date(data.project_location[0].start_date), "PP")
            : "NOT SPECIFIED"}
        </span>
        <span className="text-sm text-muted-foreground">
          Estimated End Date:{" "}
          {data?.project_location?.[0]?.end_date
            ? format(new Date(data.project_location[0].end_date), "PP")
            : "NOT SPECIFIED"}
        </span>
        <span className="text-sm text-muted-foreground">
          Location: {data?.project_location?.[0]?.location ?? "NOT SPECIFIED"}
        </span>
        <span className="text-sm text-muted-foreground">
          FCA:&nbsp;
          {data?.fca?.map((fca) => fca.description).join(", ") ??
            "NO FCA IDENTIFIED YET"}
        </span>
        <span className="text-sm text-muted-foreground">
          Total Alloted Area:
          {data?.project_location?.[0]?.total_alloted_area
            ? ` ${data.project_location[0].total_alloted_area} hectares`
            : "NOT SPECIFIED"}
        </span>
      </div>
      <Badge variant="outline" className={`h-7 px-4 text-xs gap-2`}>
        <div
          className={`w-2 h-2 bg-${
            data.project_location?.[0]?.status == 1 ? "primary" : "red-500"
          } rounded-full`}
        ></div>
        Project Status
      </Badge>
    </div>
  );
}

export default function ProjectDashboard() {
  const { projectID } = useParams();

  const { data, isLoading, error } = useUniversalRealtime({
    queryKey: ["project-dashboard-items", projectID as string],
    queryFn: () =>
      SelectProgramAndProjectDetailsByProjectIDAction(projectID as string),
    tables: ["projects", "farmers"],
  });

  return (
    <CustomPageLayout
      isLoading={isLoading}
      error={error}
      navItems={getUserProjectNavItems(projectID as string)}
      className="m-0 p-0"
      role="user"
    >
      {data && (
        <section className="space-y-4">
          <ProjectDashboardInfo {...data} />
          <Separator />
          <section className="p-4 space-y-4">
            <ProjectDashboardItems />
            <MonitoringReportsChart />
            <ProjectActivityLogTable />
          </section>
        </section>
      )}
    </CustomPageLayout>
  );
}
