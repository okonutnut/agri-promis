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
    <>
      <Card className="flex flex-col h-full w-full p-3 rounded-md shadow-xs">
        <CardHeader className="items-center p-0">
          <CardTitle className="text-lg">System User Types</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
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
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="gap-2 text-sm p-0">
          <div className="w-1/2 flex items-center">
            <span className="inline-block h-3 w-3 bg-(--chart-1) rounded-full mr-2"></span>
            <span>System Admin</span>
          </div>
          <div className="w-1/2 items-center">
            <span className="inline-block h-3 w-3 bg-(--chart-2) rounded-full mr-2"></span>
            <span>Field Operator</span>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
