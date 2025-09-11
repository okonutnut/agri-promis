"use client";

import dynamic from "next/dynamic";
import { Icon } from "leaflet";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectUserCurrentLocationAction } from "@/app/actions/UserSessionAction";

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

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["user_session", user_id],
    queryFn: () => SelectUserCurrentLocationAction(user_id as string),
    table: "user_session",
  });

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
        {isLoading ? (
          <Loader2 className="animate-spin text-primary" />
        ) : error ? (
          <p>Error loading GPS data</p>
        ) : data?.latitude && data?.longitude ? (
          <MapComponent />
        ) : (
          <>
            <center className="text-xs text-red-500 mx-auto">
              Cannot locate user. <br /> GPS might be turned off or no data
              available.
            </center>
          </>
        )}
      </div>
    </section>
  );
}
