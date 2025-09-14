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
    projects?: { project_name: string };
    user?: { fullname: string };
    purpose?: string;
  }[];
};
export default function ScheduledMonitoringTable({
  data,
}: ScheduledMonitoringTableProps) {
  return (
    <section className="col-span-2">
      <span className="text-lg font-semibold">
        Scheduled Monitoring ({new Date().toLocaleDateString()})
      </span>
      <div className="flex justify-center items-center border shadow-xs rounded-md">
        {/* TODAY */}
        <Table className="border-r">
          <TableHeader>
            <TableRow>
              <TableHead>Travel Order No</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead className="text-end">Field Operator</TableHead>
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
                    {item.projects?.project_name || "Unknown Project"}
                  </TableCell>
                  <TableCell>{item.purpose ?? "No Purpose Provided"}</TableCell>
                  <TableCell className="text-end">
                    {item.user?.fullname || "Unknown Operator"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No activities scheduled for today.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
