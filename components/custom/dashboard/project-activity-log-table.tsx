"use client";

import { useSelectActivityLogsByProjectIDHook } from "@/components/hooks";
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

export default function ProjectActivityLogTable(value: { project_id: string }) {
  const { data, isLoading, error } = useSelectActivityLogsByProjectIDHook(
    value.project_id
  );
  return (
    <div className="m-4 flex flex-col">
      <span className="text-lg font-semibold mb-4">Project Logs</span>
      {isLoading ? (
        <SkeletonLoading />
      ) : error ? (
        <span>Error fetching activity logs</span>
      ) : data?.length === 0 ? (
        <span>No logs yet</span>
      ) : (
        <Card className="p-2 rounded-md shadow-xs max-h-[300px] overflow-y-auto">
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
        </Card>
      )}
    </div>
  );
}
