"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyData } from "@/lib/types";

interface Props {
  data: MonthlyData[];
  maxProductionCap: number;
}

export default function ChartWeeklyPace({ data, maxProductionCap }: Props) {
  const chartData = data.map((m) => ({
    label: m.label,
    週次ペース: Math.round(m.weeklyPace),
    超過: m.capacityExceeded,
  }));

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">週次ペース vs 製造キャパ</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--muted)" }} />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            tickFormatter={(v) => v.toLocaleString()}
            label={{ value: "個/週", angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--muted)", offset: 10 }}
          />
          <Tooltip
            formatter={(value: number | undefined, name: string | undefined) => [value !== undefined ? value.toLocaleString() + "個/週" : "", name ?? ""]}
            contentStyle={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--foreground)",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", color: "var(--muted)" }} />
          <ReferenceLine
            y={maxProductionCap}
            stroke="var(--chart-cap)"
            strokeDasharray="6 3"
            strokeWidth={2}
            label={{
              value: `上限: ${maxProductionCap}個/週`,
              position: "insideTopRight",
              fontSize: 11,
              fill: "var(--chart-cap)",
            }}
          />
          <Line
            type="monotone"
            dataKey="週次ペース"
            stroke="var(--chart-revenue)"
            strokeWidth={2.5}
            dot={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  key={`dot-${payload.label}`}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={payload.超過 ? "var(--chart-cap)" : "var(--chart-revenue)"}
                  stroke="var(--card-bg)"
                  strokeWidth={2}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
