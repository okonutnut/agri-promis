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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectActivityLogsByProjectIDAction } from "@/app/actions/ActivityLogAction";
import { useParams } from "next/navigation";

export default function ProjectActivityLogTable() {
  const params = useParams();
  const projectLocationID = (params.projectID || params.locationID) as string;

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["project-activity-logs", projectLocationID],
    queryFn: () => SelectActivityLogsByProjectIDAction(projectLocationID),
    table: "activity_logs",
  });

  return (
    <Card className="p-2 rounded-md shadow-xs overflow-y-auto">
      <CardHeader className="p-0 justify-between">
        <CardTitle className="text-lg">Activity Logs</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
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
                    <TableCell>
                      {activity.user?.fullname ?? "Unknown User"}
                    </TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(activity.created_at), "PPpp")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
