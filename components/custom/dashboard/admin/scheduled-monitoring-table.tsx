"use client";

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
    travel_order_no?: string;
    user?: { fullname: string };
    purpose?: string;
  }[];
};
export default function ScheduledMonitoringTable({
  data,
}: ScheduledMonitoringTableProps) {
  return (
    <>
      <span className="text-lg font-semibold">Scheduled Monitoring</span>
      <div className="flex justify-center items-center border shadow-xs rounded-md">
        {/* TODAY */}
        <Table className="border-r">
          <TableHeader>
            <TableRow>
              <TableHead>Travel Order No</TableHead>
              <TableHead>Field Operator</TableHead>
              <TableHead>Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.travel_order_no || "Unknown Travel Order No"}
                  </TableCell>
                  <TableCell>
                    {item.user?.fullname || "Unknown Operator"}
                  </TableCell>
                  <TableCell>{item.purpose ?? "No Purpose Provided"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No activities scheduled for today.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
