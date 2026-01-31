"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectTravelOrdersAnalyticsAction } from "@/app/actions/DashboardAction";
import { Plane, Calendar, CheckCircle, Clock } from "lucide-react";
import SummaryCard from "@/components/custom/card/summary-cards";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

export default function TravelOrdersAnalytics() {
  const { data, isLoading } = useRealtimeQuery({
    queryKey: ["travel-orders-analytics"],
    queryFn: SelectTravelOrdersAnalyticsAction,
    table: "travel_order",
  });

  const chartData = useMemo(() => {
    if (!data?.travelOrdersByProgram) return [];
    return Object.entries(data.travelOrdersByProgram).map(([program, count]) => ({
      program: program.length > 15 ? program.substring(0, 15) + "..." : program,
      count: count as number,
    }));
  }, [data]);

  const monthlyData = useMemo(() => {
    if (!data?.travelOrdersByMonth) return [];
    return Object.entries(data.travelOrdersByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, count]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        count: count as number,
      }));
  }, [data]);

  const statusData = useMemo(() => {
    if (!data) return [];
    return [
      { name: "Active", value: data.activeTravelOrders || 0 },
      { name: "Upcoming", value: data.upcomingTravelOrders || 0 },
      { name: "Completed", value: data.completedTravelOrders || 0 },
    ].filter((item) => item.value > 0);
  }, [data]);

  const chartConfig = {
    count: {
      label: "Travel Orders",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <SummaryCard
          title="Total"
          description="Travel Orders"
          icon={Plane}
          isLoading={isLoading}
        >
          <strong className="text-2xl">{data?.totalTravelOrders || 0}</strong>
        </SummaryCard>
        <SummaryCard
          title="Active"
          description="Active Orders"
          icon={Clock}
          isLoading={isLoading}
        >
          <strong className="text-2xl">{data?.activeTravelOrders || 0}</strong>
        </SummaryCard>
        <SummaryCard
          title="Upcoming"
          description="Upcoming Orders"
          icon={Calendar}
          isLoading={isLoading}
        >
          <strong className="text-2xl">{data?.upcomingTravelOrders || 0}</strong>
        </SummaryCard>
        <SummaryCard
          title="Completed"
          description="Completed Orders"
          icon={CheckCircle}
          isLoading={isLoading}
        >
          <strong className="text-2xl">{data?.completedTravelOrders || 0}</strong>
        </SummaryCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Pie Chart */}
        {statusData.length > 0 && (
          <Card className="h-full w-full p-2 rounded-md shadow-xs">
            <CardHeader className="p-0">
              <CardTitle className="text-lg">Travel Orders Status</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ChartContainer config={chartConfig}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}


        {/* Travel Orders by Month */}
        <Card className="h-full w-full p-2 rounded-md shadow-xs">
          <CardHeader className="p-0">
            <CardTitle className="text-lg">Travel Orders by Month</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {monthlyData.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis tickLine={false} axisLine={false} width={30} allowDecimals={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      {/* Travel Orders by Program */}
      <Card className="h-full w-full p-2 rounded-md shadow-xs">
        <CardHeader className="p-0">
          <CardTitle className="text-lg">Travel Orders by Program</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{ right: 16 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="program"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={100}
                />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="count"
                  layout="vertical"
                  fill="var(--color-count)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

