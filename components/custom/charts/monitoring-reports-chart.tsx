"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectMonitoringReportsCountByDate } from "@/app/actions/DashboardAction";
import { useParams } from "next/navigation";

const chartConfig = {
  reports: {
    label: "Reports",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function MonitoringReportsChart() {
  const { locationID } = useParams();

  const { data: chartData = [] } = useRealtimeQuery({
    queryFn: async () =>
      await SelectMonitoringReportsCountByDate(locationID as string),
    queryKey: ["monitoring-reports-count-by-date", locationID as string],
    table: "monitoring",
  });

  return (
    <div className="col-span-2">
      <Card className="w-full p-2 rounded-md shadow-xs">
        <CardHeader className="p-0">
          <CardTitle className="text-lg">Monitoring Reports</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-62.5 w-full"
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
