"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ScheduledMonitoringTableProps = {
  data: {
    id: string;
    travel_order: {
      travel_order_no: string;
      user: { fullname: string };
    } | null;
    projects?: { project_name: string };
    user?: { fullname: string };
    purpose?: string;
  }[];
};
export default function ScheduledMonitoringTable({
  data,
}: ScheduledMonitoringTableProps) {
  return (
    <div className="w-full">
      <Card className="shadow-xs rounded-md p-2 h-full">
        <CardHeader className="items-center p-0">
          <CardTitle className="text-lg">
            Scheduled Monitoring (Upcoming)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">#</TableHead>
                <TableHead>Travel Order No</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead className="text-end">Field Operator</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      {item.travel_order?.travel_order_no ||
                        "Unknown Travel Order No"}
                    </TableCell>
                    <TableCell>
                      {item.purpose ?? "No Purpose Provided"}
                    </TableCell>
                    <TableCell className="text-end">
                      {item.travel_order?.user?.fullname ||
                        "Unknown Operator"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No upcoming activities scheduled.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
