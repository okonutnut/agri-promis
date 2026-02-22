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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProjectDetailsPage() {
  const { programID, projectID } = useParams();

  const { data, isLoading, error } = useUniversalRealtime({
    queryFn: async () =>
      await SelectProjectDashboardItemsAction(projectID as string),
    queryKey: ["project-dashboard-items", projectID as string],
    tables: ["projects", "monitoring", "farmers"],
  });

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
      <div className="grid grid-cols-2 gap-4 min-h-[50vh]">
        {/* UNREVIEWED MONITORING REPORTS */}
        <Card className="col-span-full p-0 rounded-md gap-0">
          <span className="p-2 text-lg font-semibold">
            Unreviewed Monitoring Reports
          </span>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 font-medium">#</TableHead>
                <TableHead className="w-35">Travel Order No</TableHead>
                <TableHead className="flex-1">Fullname</TableHead>
                <TableHead className="flex-1">Purpose</TableHead>
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
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {report.travel_order_no}
                    </TableCell>
                    <TableCell className="truncate">
                      {report.fullname || "Unknown User"}
                    </TableCell>
                    <TableCell className="truncate">
                      {report.purpose || "No purpose provided"}
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
      </div>
    </CustomPageLayout>
  );
}
