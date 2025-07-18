import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ViewFieldTechnicianPanel() {
  return (
    <section className="p-2 space-y-4 overflow-y-auto">
      <div>
        <Label htmlFor="gps-card" className="mb-1">
          Geolocation:
        </Label>
        <div id="gps-card" className="w-full border rounded-md h-64 mb-4">
          GPS
        </div>
      </div>
      <div>
        <Label htmlFor="recent-activities" className="mb-1">
          Recent Activities:
        </Label>
        <div
          id="recent-activities"
          className="w-full flex justify-between items-center border rounded-md h-12 mb-4 p-2"
        >
          Uploaded a Field Report
          <Button variant={"ghost"} size={"sm"}>
            View
          </Button>
        </div>
      </div>
    </section>
  );
}
