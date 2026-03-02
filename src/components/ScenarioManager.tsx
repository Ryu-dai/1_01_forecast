"use client";

import React, { useState } from "react";
import type { Scenario } from "@/lib/types";

interface Props {
  scenarios: Scenario[];
  onSave: (name: string) => void;
  onDelete: (id: string) => void;
  canSave: boolean;
}

export default function ScenarioManager({ scenarios, onSave, onDelete, canSave }: Props) {
  const [name, setName] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleSave = () => {
    const trimmed = name.trim() || `シナリオ ${scenarios.length + 1}`;
    onSave(trimmed);
    setName("");
    setShowInput(false);
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          シナリオ管理
          <span className="ml-2 text-xs text-[var(--muted)] font-normal">({scenarios.length}/3)</span>
        </h3>
        {canSave && !showInput && (
          <button
            onClick={() => setShowInput(true)}
            className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
          >
            + 保存
          </button>
        )}
        {!canSave && (
          <span className="text-xs text-[var(--muted)]">最大3つまで</span>
        )}
      </div>

      {showInput && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="シナリオ名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="flex-1 px-3 py-1.5 text-sm bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
          >
            保存
          </button>
          <button
            onClick={() => { setShowInput(false); setName(""); }}
            className="px-3 py-1.5 bg-[var(--border)] hover:opacity-80 text-[var(--foreground)] text-sm rounded-lg transition-colors"
          >
            キャンセル
          </button>
        </div>
      )}

      {scenarios.length === 0 ? (
        <p className="text-xs text-[var(--muted)] text-center py-3">
          現在の設定を保存して比較できます
        </p>
      ) : (
        <div className="space-y-2">
          {scenarios.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: ["#6366f1", "#22c55e", "#f59e0b"][i] }}
                />
                <span className="text-sm text-[var(--foreground)] truncate">{s.name}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-[var(--muted)]">
                  ¥{(s.result.totalProfit / 10000).toFixed(0)}万
                </span>
                <button
                  onClick={() => onDelete(s.id)}
                  className="text-xs text-[var(--muted)] hover:text-red-400 transition-colors"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
