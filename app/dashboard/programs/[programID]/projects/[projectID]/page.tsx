"use client";

import { ChevronLeft, LocateIcon, Megaphone, UsersRound } from "lucide-react";
import { useParams } from "next/navigation";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import SummaryCard from "@/components/custom/card/summary-cards";
import { SelectProjectDashboardItemsAction } from "@/app/actions/DashboardAction";
import { useUniversalRealtime } from "@/hooks/use-universal-realtime";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default function ProjectDetailsPage() {
  const { programID, projectID } = useParams();

  const { data, isLoading, error } = useUniversalRealtime({
    queryFn: async () =>
      await SelectProjectDashboardItemsAction(projectID as string),
    queryKey: ["project-dashboard-items", projectID as string],
    tables: ["projects", "monitoring", "farmers"],
  });

  console.log("Project Dashboard Data:", data);

  return (
    <CustomPageLayout
      pageTitle="Project Overview"
      pageDescription="Project overview and details."
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(programID as string, projectID as string)}
      topRightComponent={
        <Link
          href={`/dashboard/programs/${programID}/projects`}
          prefetch={true}
        >
          <Button variant={"outline"}>
            <ChevronLeft />
            Back
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-3 gap-4 mb-4">
        <SummaryCard icon={LocateIcon} title="Total Locations">
          <strong className="text-4xl">
            {data?.projectLocationsCount || 0}
          </strong>
        </SummaryCard>
        <SummaryCard icon={Megaphone} title="Total Monitoring Reports">
          <strong className="text-4xl">
            {data?.monitoringReportsCount || 0}
          </strong>
        </SummaryCard>
        <SummaryCard icon={UsersRound} title="Total Assigned FCA">
          <strong className="text-4xl">{data?.fcaCount || 0}</strong>
        </SummaryCard>
      </div>
      <div className="grid grid-cols-2 gap-4 min-h-[60vh]">
        {/* UNREVIEWED MONITORING REPORTS */}
        <Card className="col-span-full p-0 rounded-md gap-0">
          <span className="p-2 text-lg font-semibold">
            Unreviewed Monitoring Reports
          </span>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-30">Travel Order No</TableHead>
                <TableHead className="flex-1">Fullname</TableHead>
                <TableHead className="flex-1">Purpose</TableHead>
                <TableHead className="flex-1">Date Created</TableHead>
                <TableHead className="w-28 text-end">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.unreviewedMonitoringReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No unreviewed monitoring reports found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.unreviewedMonitoringReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {report.travel_order_no}
                    </TableCell>
                    <TableCell className="truncate">
                      {report.fullname || "Unknown User"}
                    </TableCell>
                    <TableCell className="truncate">
                      {report.purpose || "No purpose provided"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(report.created_at), "PP")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/dashboard/project-location/${report.project_location_id}/monitoring-reports`}
                        prefetch={true}
                      >
                        <Button size={"sm"} variant={"outline"}>
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* ACTIVITY LOGS */}
        <Card className="col-span-full p-0 rounded-md gap-0">
          <span className="p-2 text-lg font-semibold">Activity Logs</span>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead className="w-50">Fullname</TableHead>
                <TableHead className="flex-1">Activity</TableHead>
                <TableHead className="w-24 text-end">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>Darlito Dela Cruz Cabalse Jr</TableCell>
                <TableCell className="truncate">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse
                  vel eius excepturi corporis, sapiente eligendi vero omnis
                  accusamus laboriosam earum sed alias ex sunt dolor quae odio
                  animi! Natus, et?
                </TableCell>
                <TableCell className="text-right">
                  {format(new Date(), "PP")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </CustomPageLayout>
  );
}
