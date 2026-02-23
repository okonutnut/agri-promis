"use client";

import { ActivityLogType } from "@/components/types";
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

type UserActivityLogsProps = {
  data: ActivityLogType[] | undefined;
};
export default function UserActivityLogs({ data }: UserActivityLogsProps) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Recent Activity Logs</h2>
      <Card className="p-0 shadow-xs rounded-md max-h-125 overflow-auto">
        {data && data.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No activity logs found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">Date Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {log.description}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.created_at
                        ? format(new Date(log.created_at), "PPp")
                        : "Not Specified"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </>
  );
}
