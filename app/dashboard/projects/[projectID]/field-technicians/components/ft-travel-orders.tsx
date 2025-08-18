"use client";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import { useSelectAllTravelOrdersByUserIDHook } from "@/components/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

type FTTravelOrdersProps = {
  user_id: string;
};
export default function FTTravelOrders({ user_id }: FTTravelOrdersProps) {
  const { data, isLoading, error } =
    useSelectAllTravelOrdersByUserIDHook(user_id);
  return (
    <>
      <span className="font-semibold text-lg">Travel Orders</span>
      {isLoading ? (
        <SkeletonLoading className="mx-auto" />
      ) : error ? (
        <div className="text-red-500 text-center">
          Error loading travel orders: {error.message}
        </div>
      ) : (
        <Table className="mx-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">T.O No</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead className="text-right">Date Issued</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.travel_order_no}
                  </TableCell>
                  <TableCell>{order.purpose}</TableCell>
                  <TableCell className="text-right">
                    {format(new Date(order.created_at ?? ""), "MMM dd, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
