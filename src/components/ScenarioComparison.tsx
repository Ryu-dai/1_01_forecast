"use client";

import React from "react";
import type { Scenario } from "@/lib/types";
import { AWARENESS_LABELS } from "@/lib/constants";

interface Props {
  scenarios: Scenario[];
}

const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

function MetricRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="grid gap-1 py-2 border-b border-[var(--border)] last:border-0" style={{ gridTemplateColumns: `120px repeat(${values.length}, 1fr)` }}>
      <span className="text-xs text-[var(--muted)] self-center">{label}</span>
      {values.map((v, i) => (
        <span key={i} className="text-sm font-semibold text-[var(--foreground)] text-right">
          {v}
        </span>
      ))}
    </div>
  );
}

export default function ScenarioComparison({ scenarios }: Props) {
  if (scenarios.length === 0) return null;

  const fmt = (v: number) => `¥${(v / 10000).toFixed(0)}万`;
  const fmtU = (v: number) => v.toLocaleString() + "個";

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">シナリオ比較</h3>

      {/* Header */}
      <div className="grid gap-1 mb-2 pb-2 border-b-2 border-[var(--border)]" style={{ gridTemplateColumns: `120px repeat(${scenarios.length}, 1fr)` }}>
        <div />
        {scenarios.map((s, i) => (
          <div key={s.id} className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-sm font-bold text-[var(--foreground)] truncate max-w-[80px]">{s.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <MetricRow label="期間" values={scenarios.map((s) => `${s.params.periodMonths}ヶ月`)} />
      <MetricRow label="販売価格" values={scenarios.map((s) => `¥${s.params.price.toLocaleString()}`)} />
      <MetricRow label="目標利益" values={scenarios.map((s) => fmt(s.params.targetProfit))} />
      <MetricRow label="認知カーブ" values={scenarios.map((s) => AWARENESS_LABELS[s.params.awarenessCurve])} />
      <MetricRow label="必要販売数" values={scenarios.map((s) => fmtU(s.result.requiredUnits))} />
      <MetricRow label="週次ペース" values={scenarios.map((s) => s.result.weeklyPaceRequired.toFixed(0) + "個/週")} />
      <MetricRow label="予測売上" values={scenarios.map((s) => fmt(s.result.totalRevenue))} />
      <MetricRow label="予測利益" values={scenarios.map((s) => fmt(s.result.totalProfit))} />
      <MetricRow
        label="達成確度"
        values={scenarios.map((s) => {
          const pct = s.result.achievabilityPct;
          return `${pct}%`;
        })}
      />
      <MetricRow
        label="キャパ問題"
        values={scenarios.map((s) => (s.result.capacityShortfall ? "⚠ 超過あり" : "✓ 問題なし"))}
      />

      {/* Mini bar chart comparison */}
      <div className="mt-4 pt-3 border-t border-[var(--border)]">
        <div className="text-xs text-[var(--muted)] mb-2">予測利益 比較</div>
        <div className="space-y-2">
          {scenarios.map((s, i) => {
            const maxProfit = Math.max(...scenarios.map((sc) => sc.result.totalProfit));
            const pct = maxProfit > 0 ? (s.result.totalProfit / maxProfit) * 100 : 0;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <span className="text-xs text-[var(--muted)] w-16 truncate">{s.name}</span>
                <div className="flex-1 bg-[var(--border)] rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: COLORS[i] }}
                  />
                </div>
                <span className="text-xs font-semibold text-[var(--foreground)] w-16 text-right">
                  {fmt(s.result.totalProfit)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
