"use client";

import { useSelectTravelOrdersByDateHook } from "@/components/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonLoading from "../../layout/skeleton-loading";

export default function ScheduledMonitoringTable() {
  const { data, isLoading } = useSelectTravelOrdersByDateHook();

  return (
    <section className="mt-7">
      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <>
          {data && (
            <>
              <span className="text-lg font-semibold">
                Scheduled Monitoring
              </span>
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
                    {data.length > 0 ? (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.travel_order_no || "Unknown Travel Order No"}
                          </TableCell>
                          <TableCell>
                            {item.user?.fullname || "Unknown Operator"}
                          </TableCell>
                          <TableCell>
                            {item.purpose ?? "No Purpose Provided"}
                          </TableCell>
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
          )}
        </>
      )}
    </section>
  );
}
