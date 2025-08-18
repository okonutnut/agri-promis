"use client";

import dynamic from "next/dynamic";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { useSelectProgramAndProjectDetailsByProgjectIDHook } from "@/components/hooks";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { ProjectType } from "@/components/types";
import ProjectActivityLogTable from "@/components/custom/dashboard/project-activity-log-table";

const ProjectDashboardItems = dynamic(
  () => import("@/components/custom/dashboard/admin/dashboard-summary-items"),
  {
    ssr: false,
  }
);

function ProjectDashboardInfo(data: ProjectType) {
  return (
    <div className="py-10 px-4 flex justify-between items-start cursor-default">
      <div className="flex flex-col gap-1 text-2xl font-medium ">
        {data?.project_name}
        <span className="text-sm text-muted-foreground mt-4">
          Start Date: {format(new Date(data?.start_date), "PP")}
        </span>
        <span className="text-sm text-muted-foreground">
          Estimated End Date: {format(new Date(data?.end_date), "PP")}
        </span>
        <span className="text-sm text-muted-foreground">
          Location: {data.location ?? "Not specified"}
        </span>
      </div>
      <Badge variant="outline" className={`h-7 px-4 text-xs gap-2`}>
        <div
          className={`w-2 h-2 bg-${
            data.status == 1 ? "primary" : "red-500"
          } rounded-full`}
        ></div>
        Project Status
      </Badge>
    </div>
  );
}

export default function ProjectDashboard() {
  const { projectID } = useParams();
  const { data, isLoading, error } =
    useSelectProgramAndProjectDetailsByProgjectIDHook(projectID as string);

  return (
    <CustomPageLayout
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(projectID as string)}
      className="m-0 p-0"
    >
      {data && (
        <section className="space-y-4">
          <ProjectDashboardInfo {...data} />
          <Separator />
          <ProjectDashboardItems projectID={projectID as string} />
          <ProjectActivityLogTable project_id={projectID as string} />
        </section>
      )}
    </CustomPageLayout>
  );
}
