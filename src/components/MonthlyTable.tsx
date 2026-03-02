"use client";

import React from "react";
import type { MonthlyData } from "@/lib/types";

interface Props {
  data: MonthlyData[];
}

const fmtY = (v: number) => `¥${v.toLocaleString()}`;
const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`;

export default function MonthlyTable({ data }: Props) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">月別詳細</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs">
              <th className="text-left px-4 py-2 font-medium">月</th>
              <th className="text-right px-3 py-2 font-medium">認知度</th>
              <th className="text-right px-3 py-2 font-medium">販売数(個)</th>
              <th className="text-right px-3 py-2 font-medium">週ペース</th>
              <th className="text-right px-3 py-2 font-medium">売上</th>
              <th className="text-right px-3 py-2 font-medium">利益</th>
              <th className="text-right px-4 py-2 font-medium">累計利益</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr
                key={m.month}
                className={`border-b border-[var(--border)] last:border-0 transition-colors ${
                  m.capacityExceeded
                    ? "bg-red-900/30 hover:bg-red-900/40"
                    : "hover:bg-[var(--border)]/30"
                }`}
              >
                <td className="px-4 py-2.5 font-medium text-[var(--foreground)]">
                  {m.label}
                  {m.capacityExceeded && (
                    <span className="ml-2 text-xs text-red-400 font-normal">⚠ キャパ超過</span>
                  )}
                </td>
                <td className="text-right px-3 py-2.5 text-[var(--muted)]">
                  {fmtPct(m.awarenessFactor)}
                </td>
                <td className="text-right px-3 py-2.5 font-semibold text-[var(--foreground)]">
                  {m.unitsSold.toLocaleString()}
                </td>
                <td className={`text-right px-3 py-2.5 ${m.capacityExceeded ? "text-red-400 font-semibold" : "text-[var(--muted)]"}`}>
                  {m.weeklyPace.toFixed(0)}
                </td>
                <td className="text-right px-3 py-2.5 text-[var(--foreground)]">
                  {fmtY(m.revenue)}
                </td>
                <td className="text-right px-3 py-2.5 text-emerald-500 font-medium">
                  {fmtY(m.profit)}
                </td>
                <td className="text-right px-4 py-2.5 text-[var(--foreground)] font-semibold">
                  {fmtY(m.cumulativeProfit)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--border)] bg-[var(--border)]/20">
              <td className="px-4 py-2.5 font-bold text-[var(--foreground)]" colSpan={2}>合計</td>
              <td className="text-right px-3 py-2.5 font-bold text-[var(--foreground)]">
                {data.reduce((s, m) => s + m.unitsSold, 0).toLocaleString()}
              </td>
              <td className="px-3 py-2.5" />
              <td className="text-right px-3 py-2.5 font-bold text-[var(--foreground)]">
                {fmtY(data.reduce((s, m) => s + m.revenue, 0))}
              </td>
              <td className="text-right px-3 py-2.5 font-bold text-emerald-500">
                {fmtY(data.reduce((s, m) => s + m.profit, 0))}
              </td>
              <td className="px-4 py-2.5" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
