"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { SimResult } from "@/lib/types";
import { CHANNEL_LABELS, CHANNEL_COLORS } from "@/lib/constants";

interface Props {
  result: SimResult;
}

export default function ChartChannelPie({ result }: Props) {
  const { monthlyData } = result;

  // Aggregate channel totals
  const totals = { direct: 0, retail: 0, ec: 0, wholesale: 0 };
  for (const m of monthlyData) {
    totals.direct += m.channelBreakdown.direct;
    totals.retail += m.channelBreakdown.retail;
    totals.ec += m.channelBreakdown.ec;
    totals.wholesale += m.channelBreakdown.wholesale;
  }

  const data = Object.entries(totals)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      name: CHANNEL_LABELS[key] || key,
      value,
      color: CHANNEL_COLORS[key],
    }));

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">チャネル別 販売数</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | undefined, name: string | undefined) => [value !== undefined ? value.toLocaleString() + "個" : "", name ?? ""]}
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
