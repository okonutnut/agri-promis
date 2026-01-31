"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectTotalProjectsPerProgramAction } from "@/app/actions/DashboardAction";

export const description = "A bar chart with a custom label";

export default function TotalProjectsPerProgram() {
  const { data } = useRealtimeQuery({
    queryKey: ["total-projects-per-program"],
    queryFn: SelectTotalProjectsPerProgramAction,
    table: "projects",
  });

  const chartData = data?.map((item) => ({
    program: item.program_name,
    projects: item.projects?.[0]?.count || 0,
  }));

  const chartConfig = {
    projects: {
      label: "Projects",
      color: "var(--chart-1)",
    },
    label: {
      color: "var(--background)",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="h-full w-full p-2 rounded-md shadow-xs flex flex-col">
        <CardHeader className="p-0 flex-shrink-0">
          <CardTitle className="text-lg">Total Projects Per Program</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-auto">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="program"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="projects" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="projects"
                layout="vertical"
                fill="var(--color-projects)"
                radius={4}
              >
                <LabelList
                  dataKey="program"
                  position="insideLeft"
                  offset={8}
                  className="fill-(--color-label)"
                  fontSize={12}
                />
                <LabelList
                  dataKey="projects"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
