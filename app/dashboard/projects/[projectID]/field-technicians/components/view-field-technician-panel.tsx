import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FTGPSCard from "./gps/gps-card";
import { AssignedProjectsType } from "@/components/types";

type ViewFieldTechnicianPanelProps = {
  selectedRow: AssignedProjectsType | null;
};
export default function ViewFieldTechnicianPanel({
  selectedRow,
}: ViewFieldTechnicianPanelProps) {
  return (
    <section className="p-2 space-y-4 overflow-y-auto h-[calc(100vh)]">
      <FTGPSCard user_id={selectedRow?.user_id as string} />
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
