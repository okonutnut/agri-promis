"use client";

import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

type CirclePercentProps = {
  percent: number;
  // zero-based index of the stage; when 0 (first stage) percent should be shown as 0%
  stageIndex?: number;
};

export function CirclePercent({ percent, stageIndex }: CirclePercentProps) {
  // If stageIndex is provided and is the first stage (0), force 0%
  // Keep behavior backward-compatible by not requiring stageIndex.
  const effectivePercent = stageIndex === 0 ? 0 : percent;
  const validPercent =
    typeof effectivePercent === "number"
      ? Math.max(0, Math.min(effectivePercent, 100))
      : 0;

  const endAngle = (validPercent / 100) * 360;

  const chartData = [
    {
      browser: "safari",
      visitors: 100,
      fill: "var(--primary)",
    },
  ];

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={90 + endAngle}
          innerRadius="70%"
          outerRadius="80%"
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          barSize={10}
        >
          <PolarGrid gridType="circle" radialLines={false} stroke="none" />
          <RadialBar dataKey="visitors" background cornerRadius={10} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-foreground">
          {Math.round(validPercent)}%
        </span>
      </div>
    </div>
  );
}
