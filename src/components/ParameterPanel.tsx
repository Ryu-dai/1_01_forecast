"use client";

import React from "react";
import type { SimParams, AwarenessCurve } from "@/lib/types";
import { PARAM_RANGES, AWARENESS_LABELS } from "@/lib/constants";
import SliderInput from "./SliderInput";
import ChannelDistribution from "./ChannelDistribution";
import { getSparklinePath } from "@/lib/awareness";

const fmt = (v: number) => `¥${v.toLocaleString()}`;
const fmtM = (v: number) => `¥${(v / 10000).toFixed(0)}万`;

interface Props {
  params: SimParams;
  onChange: (p: SimParams | ((prev: SimParams) => SimParams)) => void;
  onChangeImmediate: (p: SimParams | ((prev: SimParams) => SimParams)) => void;
}

export default function ParameterPanel({ params, onChange, onChangeImmediate }: Props) {
  const margin = params.price - params.cogs;
  const marginRate = params.price > 0 ? Math.round((margin / params.price) * 100) : 0;

  return (
    <div className="space-y-6 p-4">
      {/* Product */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
          プロダクト
        </h3>
        <div className="space-y-4">
          <SliderInput
            label="販売価格"
            value={params.price}
            min={PARAM_RANGES.price.min}
            max={PARAM_RANGES.price.max}
            step={PARAM_RANGES.price.step}
            unit="円"
            format={fmt}
            onChange={(v) => onChange((p) => ({ ...p, price: v }))}
            onChangeImmediate={(v) => onChangeImmediate((p) => ({ ...p, price: v }))}
          />
          <SliderInput
            label="原価 (COGS)"
            value={params.cogs}
            min={PARAM_RANGES.cogs.min}
            max={Math.min(PARAM_RANGES.cogs.max, params.price - 100)}
            step={PARAM_RANGES.cogs.step}
            unit="円"
            format={fmt}
            onChange={(v) => onChange((p) => ({ ...p, cogs: v }))}
            onChangeImmediate={(v) => onChangeImmediate((p) => ({ ...p, cogs: v }))}
          />
          {/* Margin display */}
          <div className="flex items-center justify-between text-sm bg-[var(--card-bg)] rounded-lg px-3 py-2 border border-[var(--border)]">
            <span className="text-[var(--muted)]">粗利</span>
            <span className="font-semibold text-emerald-500">
              {fmt(margin)} ({marginRate}%)
            </span>
          </div>
        </div>
      </section>

      {/* Period */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
          シミュレーション期間
        </h3>
        <div className="flex gap-2">
          {PARAM_RANGES.periodMonths.options.map((m) => (
            <button
              key={m}
              onClick={() => onChangeImmediate((p) => ({ ...p, periodMonths: m }))}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                params.periodMonths === m
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-[var(--card-bg)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-400"
              }`}
            >
              {m}ヶ月
            </button>
          ))}
        </div>
      </section>

      {/* Target */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
          目標
        </h3>
        <SliderInput
          label="目標利益"
          value={params.targetProfit}
          min={PARAM_RANGES.targetProfit.min}
          max={PARAM_RANGES.targetProfit.max}
          step={PARAM_RANGES.targetProfit.step}
          unit="円"
          format={fmtM}
          onChange={(v) => onChange((p) => ({ ...p, targetProfit: v }))}
          onChangeImmediate={(v) => onChangeImmediate((p) => ({ ...p, targetProfit: v }))}
        />
      </section>

      {/* Team */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
          チーム / 製造キャパ
        </h3>
        <div className="space-y-4">
          <SliderInput
            label="チーム人数"
            value={params.teamSize}
            min={PARAM_RANGES.teamSize.min}
            max={PARAM_RANGES.teamSize.max}
            step={PARAM_RANGES.teamSize.step}
            unit="人"
            onChange={(v) => onChange((p) => ({ ...p, teamSize: v }))}
            onChangeImmediate={(v) => onChangeImmediate((p) => ({ ...p, teamSize: v }))}
          />
          <SliderInput
            label="1人あたり製造数/月"
            value={params.productionPerPerson}
            min={PARAM_RANGES.productionPerPerson.min}
            max={PARAM_RANGES.productionPerPerson.max}
            step={PARAM_RANGES.productionPerPerson.step}
            unit="個"
            onChange={(v) => onChange((p) => ({ ...p, productionPerPerson: v }))}
            onChangeImmediate={(v) => onChangeImmediate((p) => ({ ...p, productionPerPerson: v }))}
          />
          <SliderInput
            label="週次製造キャパ上限"
            value={params.weeklyProductionCap}
            min={PARAM_RANGES.weeklyProductionCap.min}
            max={PARAM_RANGES.weeklyProductionCap.max}
            step={PARAM_RANGES.weeklyProductionCap.step}
            unit="個/週"
            onChange={(v) => onChange((p) => ({ ...p, weeklyProductionCap: v }))}
            onChangeImmediate={(v) => onChangeImmediate((p) => ({ ...p, weeklyProductionCap: v }))}
          />
        </div>
      </section>

      {/* Awareness Curve */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
          認知度カーブ
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(AWARENESS_LABELS) as AwarenessCurve[]).map((curve) => {
            const path = getSparklinePath(curve, params.periodMonths, 60, 24);
            const active = params.awarenessCurve === curve;
            return (
              <button
                key={curve}
                onClick={() => onChangeImmediate((p) => ({ ...p, awarenessCurve: curve }))}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  active
                    ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                    : "bg-[var(--card-bg)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-400"
                }`}
              >
                <svg width="60" height="24" viewBox="0 0 60 24" className="mb-1">
                  <path
                    d={path}
                    fill="none"
                    stroke={active ? "#6366f1" : "var(--muted)"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-xs font-medium">{AWARENESS_LABELS[curve]}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Channel Distribution */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
          チャネル配分
        </h3>
        <ChannelDistribution
          channels={params.channels}
          onChange={(ch) => onChangeImmediate((p) => ({ ...p, channels: ch }))}
        />
      </section>

      {/* Price Elasticity */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            価格弾力性
          </h3>
          <button
            onClick={() =>
              onChangeImmediate((p) =>
                p.baseDemandMonthly > 0
                  ? { ...p, baseDemandMonthly: 0 }
                  : { ...p, baseDemandMonthly: 300, demandReferencePrice: p.price }
              )
            }
            className={`text-xs px-2 py-0.5 rounded border transition-colors ${
              params.baseDemandMonthly > 0
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "bg-[var(--card-bg)] border-[var(--border)] text-[var(--muted)] hover:border-indigo-400"
            }`}
          >
            {params.baseDemandMonthly > 0 ? "有効" : "無効"}
          </button>
        </div>

        {params.baseDemandMonthly > 0 && (
          <div className="space-y-4">
            <SliderInput
              label="基準需要（月間）"
              value={params.baseDemandMonthly}
              min={PARAM_RANGES.baseDemandMonthly.min}
              max={PARAM_RANGES.baseDemandMonthly.max}
              step={PARAM_RANGES.baseDemandMonthly.step}
              unit="個/月"
              onChange={(v) =>
                onChange((p) => ({ ...p, baseDemandMonthly: v, demandReferencePrice: p.price }))
              }
              onChangeImmediate={(v) =>
                onChangeImmediate((p) => ({ ...p, baseDemandMonthly: v, demandReferencePrice: p.price }))
              }
            />
            <SliderInput
              label="弾力性係数"
              value={params.priceElasticity}
              min={PARAM_RANGES.priceElasticity.min}
              max={PARAM_RANGES.priceElasticity.max}
              step={PARAM_RANGES.priceElasticity.step}
              format={(v) => v.toFixed(1)}
              onChange={(v) => onChange((p) => ({ ...p, priceElasticity: v }))}
              onChangeImmediate={(v) => onChangeImmediate((p) => ({ ...p, priceElasticity: v }))}
            />
            <div className="text-xs text-[var(--muted)] bg-[var(--card-bg)] rounded-lg px-3 py-2 border border-[var(--border)] space-y-0.5">
              <div>
                基準価格: <span className="text-[var(--foreground)] font-medium">¥{params.demandReferencePrice.toLocaleString()}</span> で月間 <span className="text-[var(--foreground)] font-medium">{params.baseDemandMonthly}個</span> と想定
              </div>
              <div className="text-indigo-400">
                ▸ 現在価格 ¥{params.price.toLocaleString()} での需要は計算済み（サマリーに表示）
              </div>
            </div>
          </div>
        )}
        {params.baseDemandMonthly === 0 && (
          <p className="text-xs text-[var(--muted)]">
            有効にすると、価格変更による需要変動を考慮した達成確度を算出します。
          </p>
        )}
      </section>
    </div>
  );
}
