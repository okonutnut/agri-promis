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
import { SelectFCAAnalyticsAction } from "@/app/actions/DashboardAction";
import { Users, CheckCircle, XCircle, Building2 } from "lucide-react";
import SummaryCard from "@/components/custom/card/summary-cards";

const COLORS = ["var(--chart-1)", "var(--chart-2)"];

export default function FCAAnalytics() {
  const { data, isLoading } = useRealtimeQuery({
    queryKey: ["fca-analytics"],
    queryFn: SelectFCAAnalyticsAction,
    table: "farmers",
  });

  const projectsPerFCAData = useMemo(() => {
    if (!data?.projectsPerFCA) return [];
    return data.projectsPerFCA
      .sort((a, b) => b.projectCount - a.projectCount)
      .slice(0, 10)
      .map((item) => ({
        fca: item.fcaName.length > 20 ? item.fcaName.substring(0, 20) + "..." : item.fcaName,
        projects: item.projectCount,
      }));
  }, [data]);

  const statusData = useMemo(() => {
    if (!data?.fcasByStatus) return [];
    return [
      { name: "Active", value: data.fcasByStatus.active || 0 },
      { name: "Inactive", value: data.fcasByStatus.inactive || 0 },
    ].filter((item) => item.value > 0);
  }, [data]);

  const chartConfig = {
    projects: {
      label: "Projects",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <SummaryCard
          title="Total"
          description="FCAs"
          icon={Building2}
          isLoading={isLoading}
        >
          <strong className="text-2xl">{data?.totalFCAs || 0}</strong>
        </SummaryCard>
        <SummaryCard
          title="Active"
          description="Active FCAs"
          icon={CheckCircle}
          isLoading={isLoading}
        >
          <strong className="text-2xl">{data?.activeFCAs || 0}</strong>
        </SummaryCard>
        <SummaryCard
          title="Inactive"
          description="Inactive FCAs"
          icon={XCircle}
          isLoading={isLoading}
        >
          <strong className="text-2xl">{data?.inactiveFCAs || 0}</strong>
        </SummaryCard>
        <SummaryCard
          title="Members"
          description="Total Members"
          icon={Users}
          isLoading={isLoading}
        >
          <strong className="text-2xl">{data?.totalMembers || 0}</strong>
        </SummaryCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Projects per FCA */}
        <Card className="h-full w-full p-2 rounded-md shadow-xs">
          <CardHeader className="p-0">
            <CardTitle className="text-lg">Projects per FCA (Top 10)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {projectsPerFCAData.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={projectsPerFCAData}
                  layout="vertical"
                  margin={{ right: 16 }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="fca"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    width={120}
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

        {/* FCA Status */}
        {statusData.length > 0 && (
          <Card className="h-full w-full p-2 rounded-md shadow-xs">
            <CardHeader className="p-0">
              <CardTitle className="text-lg">FCA Status Distribution</CardTitle>
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
      </div>

      {/* Additional Stats */}
      <Card className="h-full w-full p-4 rounded-md shadow-xs">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-lg">Additional Statistics</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">FCAs with Projects</span>
              <strong className="text-2xl">{data?.fcasWithProjects || 0}</strong>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Average Members per FCA</span>
              <strong className="text-2xl">
                {data?.totalFCAs && data.totalFCAs > 0
                  ? Math.round((data.totalMembers || 0) / data.totalFCAs)
                  : 0}
              </strong>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

