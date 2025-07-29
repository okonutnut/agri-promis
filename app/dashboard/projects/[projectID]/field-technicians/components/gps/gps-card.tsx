import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useSelectUserLocationHook } from "@/components/hooks";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type FTGPSCardProps = {
  user_id: string;
};
export default function FTGPSCard({ user_id }: FTGPSCardProps) {
  const [showMap, setShowMap] = useState(false);
  const icon = new Icon({
    iconUrl: "/location-pin.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: "leaflet-custom-icon",
  });

  const { data, isLoading, isError, refetch } = useSelectUserLocationHook(
    user_id as string
  );
  console.log("GPS Data:", data);

  return (
    <section className="p-2 space-y-4">
      <Label htmlFor="gps-card" className="mb-1">
        Current GPS Location:
      </Label>
      {!showMap ? (
        <Button
          variant={"outline"}
          onClick={() => setShowMap(true)}
          className="w-full px-4 py-2"
        >
          Get Current Location
        </Button>
      ) : isLoading ? (
        <div className="w-full h-[40vh] flex items-center justify-center border rounded-lg">
          <p>Loading...</p>
        </div>
      ) : isError ? (
        <div className="w-full h-[40vh] relative border rounded-lg">
          <p className="text-red-500">Error loading GPS data</p>
        </div>
      ) : (
        <>
          {data?.latitude && data?.longitude ? (
            <div className="w-full h-[40vh] relative border rounded-lg">
              <MapContainer
                center={[data.latitude, data.longitude]}
                zoom={13}
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
                />
              </MapContainer>
            </div>
          ) : (
            <Button
              variant={"outline"}
              onClick={() => {
                refetch();
                setShowMap(true);
              }}
              className="w-full px-4 py-2"
              disabled={isLoading}
            >
              Retry
            </Button>
          )}
        </>
      )}
    </section>
  );
}
