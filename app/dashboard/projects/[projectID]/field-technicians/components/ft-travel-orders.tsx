"use client";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import { useSelectAllTravelOrdersByUserIDHook } from "@/components/hooks";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

type FTTravelOrdersProps = {
  user_id: string;
};
export default function FTTravelOrders({ user_id }: FTTravelOrdersProps) {
  const { data, isLoading, error } =
    useSelectAllTravelOrdersByUserIDHook(user_id);

  const values = data?.filter((order) => order.is_active === 1);
  return (
    <>
      <Label className="ms-3">Active Travel Orders</Label>
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
                className="p-2 mx-3 rounded-md shadow-xs flex-row justify-between"
                key={order.id}
              >
                <div className="flex flex-1/2 flex-col gap-1">
                  <strong className="text-xs">Purpose: {order.purpose}</strong>
                  <small>Travel Order No. {order.travel_order_no}</small>
                </div>
                <small>
                  Return Date:&nbsp;
                  {format(new Date(order.return_date ?? ""), "PPp")}
                </small>
              </Card>
            ))}
        </div>
      )}
    </>
  );
}
