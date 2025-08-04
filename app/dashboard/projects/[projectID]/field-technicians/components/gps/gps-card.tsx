import { Suspense, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useSelectUserLocationHook } from "@/components/hooks";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import SkeletonLoading from "@/components/custom/layout/skeleton-loading";

type FTGPSCardProps = {
  user_id: string;
};
export default function FTGPSCard({ user_id }: FTGPSCardProps) {
  const icon = new Icon({
    iconUrl: "/location-pin.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: "leaflet-custom-icon",
  });

  const { data, isLoading, error, refetch, isFetching } =
    useSelectUserLocationHook(user_id as string);

  return (
    <Suspense fallback={<SkeletonLoading />}>
      <section className="space-y-4 pb-4 border-b">
        <Label htmlFor="gps-card" className="mb-1">
          Current Location:
          {data && (
            <span className="italic text-xs text-gray-500">
              Last update: {format(data?.created_at, "PPp")}
            </span>
          )}
        </Label>
        <div className="w-full h-[40vh] relative border rounded-lg flex flex-col items-center justify-center">
          {isLoading || isFetching ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error loading GPS data</p>
          ) : (
            <>
              {data?.latitude && data?.longitude ? (
                <MapContainer
                  center={[data.latitude, data.longitude]}
                  zoom={13}
                  dragging={false}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[data.latitude, data.longitude]}
                    icon={icon}
                  >
                    <Popup>
                      Last known location as of {format(data.created_at, "PPp")}
                      .
                    </Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <>
                  <center className="text-xs text-red-500 mx-auto">
                    Cannot locate user.
                  </center>
                  <Button
                    variant={"link"}
                    onClick={() => {
                      refetch();
                    }}
                    className="w-full px-4 py-2"
                    disabled={isLoading}
                  >
                    Retry
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </Suspense>
  );
}
