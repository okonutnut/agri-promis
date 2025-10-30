"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
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
    <div className="w-full h-full">
      <span className="text-lg font-semibold">Activity Logs</span>
      <Card className="p-1">
        <div className="flex justify-end">
          {data && data.length > 0 && (
            <Link href="/dashboard/activity-logs">
              <Button variant={"ghost"} size={"sm"}>
                <ExternalLink />
              </Button>
            </Link>
          )}
        </div>
        <Table>
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
      </Card>
    </div>
  );
}
