"use client";

import { SelectAllTravelOrdersByUserIDAction } from "@/app/actions/TravelOrderAction";
import SearchInput from "@/components/custom/input/search-input";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { format } from "date-fns";
import { useState } from "react";

type FTTravelOrdersProps = {
  user_id: string;
};
export default function FTTravelOrders({ user_id }: FTTravelOrdersProps) {
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["travel_order", user_id],
    queryFn: () => SelectAllTravelOrdersByUserIDAction(user_id),
    table: "travel_order",
  });

  const filteredValues = data?.filter((order) =>
    order.travel_order_no?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-3 my-2 space-y-4">
      <Label className="text-xl mb-2">Active Travel Orders</Label>
      <SearchInput
        placeholder="Search Travel Orders..."
        setSearchTerm={setSearch}
      />
      {isLoading ? (
        <SkeletonLoading />
      ) : error ? (
        <div className="text-red-500 text-center">
          Error loading travel orders: {error.message}
        </div>
      ) : (
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>Travel Order No.</TableHead>
              <TableHead className="text-end">Return Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredValues && filteredValues.length > 0 ? (
              <>
                {filteredValues?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.travel_order_no}</TableCell>
                    <TableCell className="text-end">
                      {format(new Date(order.return_date ?? ""), "PPp")}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center italic">
                  No active travel orders.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
