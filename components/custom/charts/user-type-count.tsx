"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectAllMembersAction } from "@/app/actions/MemberAction";

export const description = "A pie chart with no separator";

export default function TotalUsersPerType() {
  const { data } = useRealtimeQuery({
    queryKey: ["total-users-per-type"],
    queryFn: SelectAllMembersAction,
    table: "user_profile",
  });

  type UserProfile = {
    role?: string | number;
  };

  type RoleCounts = {
    [key: string]: number;
  };

  const roleCounts: RoleCounts =
    data?.reduce((acc: RoleCounts, user: UserProfile) => {
      const roleKey = String(user.role ?? "unknown");
      acc[roleKey] = (acc[roleKey] || 0) + 1;
      return acc;
    }, {} as RoleCounts) || {};

  const chartData = [
    {
      browser: "System Admin ",
      visitors: roleCounts["1"] || 0,
      fill: "var(--color-chrome)",
    },
    {
      browser: "Field Operator ",
      visitors: roleCounts["2"] || 0,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "System Admin",
      color: "var(--chart-1)",
    },
    safari: {
      label: "Field Operator",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <div className="h-full w-full flex items-center justify-center p-2 overflow-hidden">
      <ChartContainer
      config={chartConfig}
      className="mx-auto h-full w-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="browser"
            stroke="0"
            labelLine={false}
            outerRadius="70%"
            label={({ browser, percent }) => {
              // Shorten labels to fit better
              const shortName = browser.length > 12 ? browser.substring(0, 12) + "..." : browser;
              return `${shortName}: ${(percent * 100).toFixed(0)}%`;
            }}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
