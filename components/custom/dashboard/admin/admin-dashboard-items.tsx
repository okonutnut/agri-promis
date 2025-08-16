"use client";

import { useSelectAdminDashboardItemsHook } from "@/components/hooks";
import SummaryCard from "../../card/summary-cards";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, FolderKanban, Users } from "lucide-react";
import { format } from "date-fns";
import SkeletonLoading from "../../layout/skeleton-loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScheduledMonitoringTable from "./scheduled-monitoring-table";

export default function AdminDashboardItems() {
  const { data, isLoading } = useSelectAdminDashboardItemsHook();
  return (
    <>
      <section className="flex flex-wrap md:flex-nowrap justify-between gap-5">
        <SummaryCard
          isLoading={isLoading}
          title="Program"
          description="Total Created Programs"
          icon={BookOpen}
        >
          <strong className="text-4xl">{data?.totalPrograms ?? 0}</strong>
        </SummaryCard>
        <SummaryCard
          isLoading={isLoading}
          title="Projects"
          description="Total Created Projects"
          icon={FolderKanban}
        >
          <strong className="text-4xl">{data?.totalProjects ?? 0}</strong>
        </SummaryCard>
        <SummaryCard
          isLoading={isLoading}
          title="Team"
          description="Total Team Members"
          icon={Users}
        >
          <strong className="text-4xl">{data?.totalUsers ?? 0}</strong>
        </SummaryCard>
      </section>

      {/* SCHEDULED MONITORING */}
      <ScheduledMonitoringTable />

      {/* RECENT ACTIVITIES */}
      <section className="mt-7">
        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <>
            <span className="text-lg font-semibold">Recent Activities</span>
            <div className="border shadow-xs rounded-md">
              <Table>
                <TableCaption>A list of recent activities.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Fullname</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Date Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data &&
                  data.recentActivityLogs &&
                  data.recentActivityLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No recent activities
                      </TableCell>
                    </TableRow>
                  ) : (
                    data &&
                    data.recentActivityLogs &&
                    data?.recentActivityLogs.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {activity.user.fullname}
                        </TableCell>
                        <TableCell>{activity.description}</TableCell>
                        <TableCell className="text-right">
                          {format(new Date(activity.created_at), "PPp")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {data &&
                data.recentActivityLogs &&
                data.recentActivityLogs.length > 0 && (
                  <Link href="/dashboard/activity-logs">
                    <Button variant={"link"} size={"sm"} className="text-xs">
                      View All
                    </Button>
                  </Link>
                )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
