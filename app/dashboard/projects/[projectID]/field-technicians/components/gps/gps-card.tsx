"use client";

import dynamic from "next/dynamic";
import { Icon } from "leaflet";
import { useSelectUserLocationHook } from "@/components/hooks";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";

// Dynamically import the map components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

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

  const { data, isLoading, error, refetch, isRefetching } =
    useSelectUserLocationHook(user_id as string);

  const MapComponent = () => {
    if (!data?.latitude || !data?.longitude) return null;

    return (
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
        <Marker position={[data.latitude, data.longitude]} icon={icon}>
          <Popup>
            Last known location as of {format(data.modified_at, "PPp")}.
          </Popup>
        </Marker>
      </MapContainer>
    );
  };

  return (
    <section className="space-y-2 border-b">
      <Label htmlFor="gps-card" className="mb-1">
        {data && (
          <span className="italic text-xs text-gray-500">
            Last update: {format(data?.modified_at, "PPp")}
          </span>
        )}
      </Label>
      <div className="w-full h-[20vh] relative rounded-md flex flex-col items-center justify-center">
        {isLoading || isRefetching ? (
          <Loader2 className="animate-spin text-primary" />
        ) : error ? (
          <p>Error loading GPS data</p>
        ) : data?.latitude && data?.longitude ? (
          <MapComponent />
        ) : (
          <>
            <center className="text-xs text-red-500 mx-auto">
              Cannot locate user.
            </center>
            <Button
              variant={"link"}
              onClick={() => refetch()}
              className="w-full px-4 py-2"
              disabled={isLoading}
            >
              Retry
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
