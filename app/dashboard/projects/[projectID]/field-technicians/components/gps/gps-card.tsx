import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

  const { data, isLoading, error, refetch } = useSelectUserLocationHook(
    user_id as string
  );

  useEffect(() => {
    setShowMap(true);
  }, [setShowMap]);

  return (
    <section className="p-2 space-y-4">
      <Label htmlFor="gps-card" className="mb-1">
        Current Location:
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
      ) : error ? (
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
                dragging={false}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[data.latitude, data.longitude]} icon={icon}>
                  <Popup>Last known location of the user.</Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <>
              <span className="text-xs text-red-500 mx-auto">
                Cannot locate user.
              </span>
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
            </>
          )}
        </>
      )}
    </section>
  );
}
