"use client";

import { Button } from "@/components/ui/button";
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
import Link from "next/link";

type RecentActivitiesProps = {
  data: {
    user: { fullname: string };
    description: string;
    created_at: string;
  }[];
};
export default function RecentActivities({ data }: RecentActivitiesProps) {
  return (
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
            {data && data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No recent activities
                </TableCell>
              </TableRow>
            ) : (
              data &&
              data.map((activity, index) => (
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
        {data && data.length > 0 && (
          <Link href="/dashboard/activity-logs">
            <Button variant={"link"} size={"sm"} className="text-xs">
              View All
            </Button>
          </Link>
        )}
      </div>
    </>
  );
}
