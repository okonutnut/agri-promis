import FTGPSCard from "./gps/gps-card";
import { AssignedProjectsType } from "@/components/types";
import { FTRecentActivities } from "./recent-activities";

type ViewFieldTechnicianPanelProps = {
  selectedRow: AssignedProjectsType | null;
};
export default function ViewFieldTechnicianPanel({
  selectedRow,
}: ViewFieldTechnicianPanelProps) {
  return (
    <section className="p-2 space-y-4 overflow-y-auto h-[calc(100vh)]">
      <FTGPSCard user_id={selectedRow?.user_id as string} />
      <FTRecentActivities user_id={selectedRow?.user_id as string} />
    </section>
  );
}
