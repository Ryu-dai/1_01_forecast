"use client";

import React from "react";
import type { SimResult, SimParams } from "@/lib/types";

interface Props {
  result: SimResult;
  params: SimParams;
}

function Card({
  label,
  value,
  sub,
  alert,
}: {
  label: string;
  value: string;
  sub?: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        alert
          ? "bg-red-900/20 border-red-500/50"
          : "bg-[var(--card-bg)] border-[var(--border)]"
      }`}
    >
      <div className="text-xs text-[var(--muted)] font-medium mb-1">{label}</div>
      <div className={`text-xl font-bold ${alert ? "text-red-400" : "text-[var(--foreground)]"}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-[var(--muted)] mt-0.5">{sub}</div>}
    </div>
  );
}

export default function DashboardSummary({ result, params }: Props) {
  const {
    requiredUnits,
    weeklyPaceRequired,
    dailyPaceRequired,
    maxProductionCap,
    achievabilityPct,
    totalRevenue,
    totalProfit,
    capacityShortfall,
  } = result;

  const margin = params.price - params.cogs;
  const avgMarginMultiplier =
    (params.channels.direct * params.channelMargins.direct +
      params.channels.retail * params.channelMargins.retail +
      params.channels.ec * params.channelMargins.ec +
      params.channels.wholesale * params.channelMargins.wholesale) /
    100;
  const effectiveMargin = margin * avgMarginMultiplier;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <Card
        label="必要総販売数"
        value={requiredUnits.toLocaleString()}
        sub="個"
      />
      <Card
        label="必要週次ペース"
        value={weeklyPaceRequired.toFixed(0)}
        sub="個/週"
        alert={capacityShortfall}
      />
      <Card
        label="必要日次ペース"
        value={dailyPaceRequired.toFixed(0)}
        sub="個/日"
      />
      <Card
        label="製造キャパ上限"
        value={maxProductionCap.toLocaleString()}
        sub={`個/週 ${capacityShortfall ? "⚠ 不足" : "✓ 充足"}`}
        alert={capacityShortfall}
      />
      <Card
        label="予測売上"
        value={`¥${(totalRevenue / 10000).toFixed(0)}万`}
        sub={`粗利: ¥${(totalProfit / 10000).toFixed(0)}万`}
      />
      <Card
        label="達成確度"
        value={`${achievabilityPct}%`}
        sub={effectiveMargin > 0 ? `粗利/個: ¥${Math.round(effectiveMargin).toLocaleString()}` : "設定を確認"}
        alert={achievabilityPct < 80}
      />
    </div>
  );
}
