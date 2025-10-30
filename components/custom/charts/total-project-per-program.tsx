"use client";

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectTotalProjectsPerProgramAction } from "@/app/actions/DashboardAction";
import SkeletonLoading from "../layout/skeleton-loading";

const chartConfig = {
  projects: {
    label: "Projects",
  },
} satisfies ChartConfig;

export default function TotalProjectsPerProgram() {
  const { data, error, isLoading } = useRealtimeQuery({
    table: "projects",
    queryKey: ["total-projects-per-program"],
    queryFn: SelectTotalProjectsPerProgramAction,
  });

  const chartData =
    data?.map((item: any) => ({
      program: item.program_name,
      projects: item.projects?.[0]?.count ?? 0,
    })) ?? [];

  console.log("Chart Data:", chartData);

  return (
    <>
      {isLoading && <SkeletonLoading />}
      {error && <span className="text-red-500">Error loading chart data</span>}
      {data && (
        <div className="w-full h-96">
          {" "}
          {/* Set a fixed height for debugging */}
          <span className="text-lg font-semibold">
            Total Projects Per Program
          </span>
          <Card className="p-1 rounded-md">
            <CardContent className="p-0 flex flex-col justify-center items-start overflow-x-auto">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  {/* Fixed height */}
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                  >
                    <YAxis
                      dataKey="program"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      reversed
                    />
                    <XAxis dataKey="projects" type="number" hide={false} />{" "}
                    {/* Show axis for debugging */}
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="projects"
                      layout="vertical"
                      radius={6}
                      fill="oklch(0.8348 0.1302 160.9080)"
                      barSize={25}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
