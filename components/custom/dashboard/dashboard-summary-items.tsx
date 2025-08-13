import { useSelectDashboardItemsHook } from "@/components/hooks";
import SummaryCard from "../card/summary-cards";
import { ChartLine, Contact, FileStack } from "lucide-react";
import { ChartRadialText } from "./project-progress-chart";

type ProjectDashboardItemsProps = {
  projectID: string;
};
export default function ProjectDashboardItems({
  projectID,
}: ProjectDashboardItemsProps) {
  const { data, isLoading, error } = useSelectDashboardItemsHook(
    projectID as string
  );
  return (
    <section className="flex flex-wrap justify-evenly gap-5 p-4">
      <SummaryCard
        title="Progress"
        description="Project's Progress"
        icon={ChartLine}
        isLoading={isLoading || error ? true : false}
      >
        <ChartRadialText />
      </SummaryCard>
      <SummaryCard
        title="Operators"
        description="Total Assigned Field Operators"
        icon={Contact}
        isLoading={isLoading || error ? true : false}
      >
        <span className="text-4xl font-semibold">{data?.ap.length}</span>
      </SummaryCard>
      <SummaryCard
        title="Reports"
        description="Total Reports Submitted"
        icon={FileStack}
        isLoading={isLoading || error ? true : false}
      >
        <span className="text-4xl font-semibold">{data?.m.length}</span>
      </SummaryCard>
    </section>
  );
}
