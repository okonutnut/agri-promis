"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonLoading from "../layout/skeleton-loading";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectActivityLogsByProjectIDAction } from "@/app/actions/ActivityLogAction";

export default function ProjectActivityLogTable(value: { project_id: string }) {
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["project-activity-logs", value.project_id],
    queryFn: () => SelectActivityLogsByProjectIDAction(value.project_id),
    table: "activity_logs",
  });

  return (
    <div className="m-4 flex flex-col">
      <span className="text-lg font-semibold mb-4">Activity Logs</span>
      <Card className="p-0 rounded-md shadow-xs max-h-[300px] overflow-y-auto">
        {isLoading ? (
          <SkeletonLoading />
        ) : error ? (
          <div className="p-4 text-center text-gray-500">
            Error fetching activity logs.
          </div>
        ) : data?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No activity logs found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fullname</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">Date Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data.slice(0, 10).map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.user.fullname}</TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(activity.created_at), "PPpp")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
