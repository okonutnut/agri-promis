"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "A radial chart with text";

const chartData = [
  { browser: "safari", visitors: 72, fill: "var(--color-safari)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ChartRadialTextProps = {
  className?: string;
};

export function ChartRadialText({ className }: ChartRadialTextProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className={`mx-auto ${className || "aspect-square h-30 w-30"}`} // Default size if no className is provided
    >
      <RadialBarChart
        data={chartData}
        startAngle={0}
        endAngle={250}
        innerRadius="55%" // Use percentages for better responsiveness
        outerRadius="75%"
      >
        <RadialBar dataKey="visitors" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox, width, height }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                // Dynamically calculate font size based on chart dimensions
                const fontSize =
                  Math.min(Number(width) ?? 0, Number(height) ?? 0) * 0.1; // Adjust multiplier as needed
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground font-bold"
                      style={{ fontSize: `${fontSize}px` }} // Apply dynamic font size
                    >
                      {chartData[0].visitors.toLocaleString()}&#37;
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
