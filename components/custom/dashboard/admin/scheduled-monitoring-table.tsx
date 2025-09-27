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
    travel_order: {
      travel_order_no: string;
      user_profile: { fullname: string };
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
    <section className="col-span-3">
      <span className="text-lg font-semibold">
        Scheduled Monitoring ({new Date().toLocaleDateString()})
      </span>
      <div className="flex justify-center items-center border shadow-xs rounded-md">
        <Table className="border-r">
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
                  <TableCell>{item.purpose ?? "No Purpose Provided"}</TableCell>
                  <TableCell className="text-end">
                    {item.travel_order?.user_profile?.fullname ||
                      "Unknown Operator"}
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
