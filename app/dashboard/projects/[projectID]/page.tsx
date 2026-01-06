"use client";

import { getProjectNavItems } from "@/components/sidebar/navitems";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { ProjectType } from "@/components/types";
import { useUniversalRealtime } from "@/hooks/use-universal-realtime";
import { SelectProgramAndProjectDetailsByProjectIDAction } from "@/app/actions/ProjectAction";
import { useEffect } from "react";
import { addProjectToQuickAccess } from "@/utils/helpers/quickAccessHooks";
import { Button } from "@/components/ui/button";
import CustomPageLayout, {
  useModal,
} from "@/components/custom/layout/custom-page-layout";
import ProjectActivityLogTable from "@/components/custom/dashboard/project-activity-log-table";
import MonitoringReportsChart from "@/components/custom/charts/monitoring-reports-chart";
import ProjectDashboardItems from "@/components/custom/dashboard/admin/dashboard-summary-items";
import NotFoundPage from "@/app/not-found";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { EndProjectLocationAction } from "@/app/actions/ProjectLocationAction";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

function ProjectDashboardInfo(data: ProjectType) {
  const locationDetails = data?.project_location?.[0];

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async () =>
      await EndProjectLocationAction(locationDetails?.id as string),
    invalidateKeys: ["project-activity-logs", locationDetails?.id as string],
  });

  const { openModal, closeModal } = useModal();

  const handleEndProject = () => {
    openModal(
      "Attention!!!",
      "Are you sure you want to end this project? This action cannot be undone.",
      <Button
        variant={"destructive"}
        className="w-full"
        onClick={() => {
          mutate(locationDetails?.id as string, {
            onSuccess: () => {
              toast.success("Project ended successfully.");
              window.location.href = `/dashboard/programs`;
            },
            onError: () => {
              toast.error(`Error ending project. Please try again.`);
            },
          });
          closeModal();
        }}
      >
        Confirm
      </Button>
    );
  };

  return (
    <>
      <div className="py-5 px-4 flex justify-between items-start cursor-default">
        <div className="flex flex-col gap-1 text-2xl font-medium ">
          {data?.project_name ?? "..."}
          <br />
          <pre className="text-xs italic">{data?.description}</pre>
          <span className="text-sm text-muted-foreground mt-4">
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
                locationDetails?.status == 1 ? "primary" : "red-500"
              } rounded-full`}
            ></span>
            Project Status
          </Badge>
          {locationDetails?.status == 1 && (
            <Button
              variant={"destructive"}
              disabled={isPending}
              className="h-7 text-xs rounded-md"
              onClick={handleEndProject}
            >
              {isPending ? <Spinner /> : "End Project"}
            </Button>
          )}
          <Link
            href={`/dashboard/programs/${data?.program_id}/projects`}
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
  const { projectID } = useParams();

  const { data, isLoading, error } = useUniversalRealtime({
    queryKey: ["project-dashboard-items", projectID as string],
    queryFn: () =>
      SelectProgramAndProjectDetailsByProjectIDAction(projectID as string),
    tables: ["projects", "farmers", "project_location"],
  });

  // Add to quick access
  useEffect(() => {
    if (projectID) {
      addProjectToQuickAccess(projectID as string);
    }
  }, [projectID]);

  if (data === undefined && !isLoading) return <NotFoundPage />;
  if (data === undefined && isLoading) return <></>;

  return (
    <CustomPageLayout
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(projectID as string)}
      className="m-0 p-0 space-y-4"
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
