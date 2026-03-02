"use client";

import React from "react";
import type { ChannelDistribution as ChannelDist, ChannelKey } from "@/lib/types";
import { CHANNEL_LABELS, CHANNEL_COLORS } from "@/lib/constants";

interface Props {
  channels: ChannelDist;
  onChange: (channels: ChannelDist) => void;
}

const KEYS: ChannelKey[] = ["direct", "retail", "ec", "wholesale"];

export default function ChannelDistribution({ channels, onChange }: Props) {
  const handleChange = (key: ChannelKey, newVal: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newVal)));
    const others = KEYS.filter((k) => k !== key);
    const otherSum = others.reduce((s, k) => s + channels[k], 0);

    if (otherSum === 0) {
      // Distribute equally among others
      const remaining = 100 - clamped;
      const perOther = Math.floor(remaining / others.length);
      const extra = remaining - perOther * others.length;
      const next = { ...channels, [key]: clamped };
      others.forEach((k, i) => {
        next[k] = perOther + (i === 0 ? extra : 0);
      });
      onChange(next);
      return;
    }

    // Proportional redistribution
    const remaining = 100 - clamped;
    const next: ChannelDist = { ...channels, [key]: clamped };
    let assigned = 0;
    others.forEach((k, i) => {
      if (i === others.length - 1) {
        next[k] = remaining - assigned;
      } else {
        const proportional = Math.round((channels[k] / otherSum) * remaining);
        next[k] = proportional;
        assigned += proportional;
      }
    });

    // Clamp negatives
    KEYS.forEach((k) => {
      if (next[k] < 0) next[k] = 0;
    });

    // Fix rounding to ensure sum = 100
    const sum = KEYS.reduce((s, k) => s + next[k], 0);
    if (sum !== 100) {
      // Add difference to largest "other"
      const largestOther = others.reduce((a, b) => (next[a] > next[b] ? a : b));
      next[largestOther] += 100 - sum;
      if (next[largestOther] < 0) next[largestOther] = 0;
    }

    onChange(next);
  };

  const total = KEYS.reduce((s, k) => s + channels[k], 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--muted)] font-medium">チャネル配分</span>
        <span className={`text-xs font-semibold ${total === 100 ? "text-emerald-500" : "text-red-500"}`}>
          合計: {total}%
        </span>
      </div>

      {/* Bar visualization */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {KEYS.map((key) => (
          <div
            key={key}
            style={{
              width: `${channels[key]}%`,
              backgroundColor: CHANNEL_COLORS[key],
              transition: "width 0.2s ease",
            }}
          />
        ))}
      </div>

      {/* Sliders */}
      {KEYS.map((key) => (
        <div key={key} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: CHANNEL_COLORS[key] }}
              />
              <span className="text-[var(--foreground)]">{CHANNEL_LABELS[key]}</span>
            </div>
            <span className="font-semibold text-[var(--foreground)]">{channels[key]}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={channels[key]}
            onChange={(e) => handleChange(key, Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: CHANNEL_COLORS[key] }}
          />
        </div>
      ))}
    </div>
  );
}
