"use client";

import { SelectAllTravelOrdersByUserIDAction } from "@/app/actions/TravelOrderAction";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { format } from "date-fns";
import { useState } from "react";

type FTTravelOrdersProps = {
  user_id: string;
};
export default function FTTravelOrders({ user_id }: FTTravelOrdersProps) {
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["travel_order", user_id],
    queryFn: () => SelectAllTravelOrdersByUserIDAction(user_id),
    table: "travel_order",
  });

  const [search, setSearch] = useState("");
  const values = data
    ?.filter((order) => order.is_active === 1)
    ?.filter(
      (order) =>
        order.travel_order_no?.toLowerCase().includes(search.toLowerCase()) ||
        order.purpose?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="px-3 my-2 space-y-4">
      <Label className="text-xl mb-2">Active Travel Orders</Label>
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {isLoading ? (
        <SkeletonLoading className="mx-3" />
      ) : error ? (
        <div className="text-red-500 text-center">
          Error loading travel orders: {error.message}
        </div>
      ) : values?.length === 0 ? (
        <center className="italic text-sm">No active travel orders.</center>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {values &&
            values.map((order) => (
              <Card
                className="p-2 rounded-md shadow-xs flex-row justify-between"
                key={order.id}
              >
                <div className="flex flex-1/2 flex-col gap-1">
                  <small>Travel Order No. {order.travel_order_no}</small>
                  <strong className="text-xs">Purpose: {order.purpose}</strong>
                </div>
                <small>
                  Return Date:&nbsp;
                  {format(new Date(order.return_date ?? ""), "PPp")}
                </small>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
