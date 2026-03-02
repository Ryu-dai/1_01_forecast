"use client";

import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyData } from "@/lib/types";

interface Props {
  data: MonthlyData[];
}

const fmt = (v: number) => `¥${(v / 10000).toFixed(0)}万`;

export default function ChartMonthly({ data }: Props) {
  const chartData = data.map((m) => ({
    label: m.label,
    販売数: m.unitsSold,
    売上: m.revenue,
    利益: m.profit,
    累計利益: m.cumulativeProfit,
  }));

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">月別 販売数・売上・利益</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--muted)" }} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            tickFormatter={(v) => v.toLocaleString()}
            label={{ value: "販売数(個)", angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--muted)", offset: 10 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            tickFormatter={fmt}
          />
          <Tooltip
            formatter={(value: number | undefined, name: string | undefined) => {
              if (value === undefined) return ["", name ?? ""];
              if (name === "販売数") return [value.toLocaleString() + "個", name];
              return [fmt(value), name ?? ""];
            }}
            contentStyle={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--foreground)",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "var(--muted)" }}
          />
          <Bar yAxisId="left" dataKey="販売数" fill="var(--chart-units)" opacity={0.8} radius={[3, 3, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="売上" stroke="var(--chart-revenue)" strokeWidth={2} dot={{ r: 3 }} />
          <Line yAxisId="right" type="monotone" dataKey="利益" stroke="var(--chart-profit)" strokeWidth={2} dot={{ r: 3 }} />
          <Line yAxisId="right" type="monotone" dataKey="累計利益" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 3" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
