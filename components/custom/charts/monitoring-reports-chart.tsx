"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectMonitoringReportsCountByDate } from "@/app/actions/DashboardAction";

const chartConfig = {
  reports: {
    label: "Reports",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type MonitoringReportsChartProps = {
  project_id: string;
};

export default function MonitoringReportsChart({
  project_id,
}: MonitoringReportsChartProps) {
  const { data: chartData = [] } = useRealtimeQuery({
    queryKey: ["monitoring-reports-count-by-date", project_id],
    table: "monitoring",
    queryFn: () => SelectMonitoringReportsCountByDate(project_id),
  });

  return (
    <div>
      <span className="text-lg font-semibold">Monitoring Reports</span>
      <Card className="py-4 sm:py-0">
        <CardContent className="p-0 sm:p-2">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              width={undefined}
              height={undefined}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={20}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={30}
                allowDecimals={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="reports"
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  />
                }
              />
              <Line
                dataKey="reports"
                type="monotone"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
