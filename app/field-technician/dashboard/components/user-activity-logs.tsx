"use client";

import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import { useSelectAllActivityLogsByCurrentUserHook } from "@/components/hooks";
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

export default function UserActivityLogs() {
  const { data, isLoading } = useSelectAllActivityLogsByCurrentUserHook();
  return (
    <>
      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-2">Recent Activity Logs</h2>
          <Card className="p-0 shadow-xs rounded-md max-h-[500px] overflow-auto">
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
          </Card>
        </>
      )}
    </>
  );
}
