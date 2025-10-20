"use client";

import { Pie, PieChart, ResponsiveContainer, LabelList } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectUserCountPerTypeAction } from "@/app/actions/DashboardAction";

const chartConfig = {
  "1": { label: "System Admin", color: "oklch(0.8348 0.1302 160.9080)" },
  "2": { label: "Field Operator", color: "oklch(0.6231 0.1880 259.8145)" },
};

export default function TotalUsersPerType() {
  const { data } = useRealtimeQuery({
    table: "user_profile",
    queryKey: ["total-users-per-type"],
    queryFn: SelectUserCountPerTypeAction,
  });

  const total =
    data?.reduce((sum, item) => sum + (item.count as number), 0) || 0;

  const chartData =
    data?.map((item) => {
      const percentage = total
        ? (((item.count as number) / total) * 100).toFixed(0)
        : "0";
      return {
        role:
          chartConfig[item.role as keyof typeof chartConfig]?.label ||
          `Role ${item.role}`,
        count: item.count,
        percentage: `${percentage}%`,
        fill:
          chartConfig[item.role as keyof typeof chartConfig]?.color ||
          "oklch(0.6959 0.1491 162.4796)",
      };
    }) ?? [];

  return (
    <div className="col-span-2 h-[300px]">
      <span className="text-lg font-semibold">Total Users by System Role</span>
      <Card className="flex flex-col p-2 h-full rounded-md">
        <CardContent className="flex-1 p-0 flex items-center justify-center">
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-text]:fill-background w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="count" hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="role"
                  stroke="none"
                  outerRadius="80%"
                >
                  <LabelList
                    dataKey="percentage"
                    position="inside"
                    className="fill-background"
                    fontSize={12}
                    stroke="none"
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex flex-wrap justify-center gap-4 text-sm mt-2">
          {chartData.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              ></div>
              <span className="text-muted-foreground">{item.role}</span>
            </div>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
}
