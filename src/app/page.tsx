"use client";

import React, { useState } from "react";
import { useSimulation } from "@/lib/useSimulation";
import ParameterPanel from "@/components/ParameterPanel";
import DashboardSummary from "@/components/DashboardSummary";
import ChartMonthly from "@/components/ChartMonthly";
import ChartChannelPie from "@/components/ChartChannelPie";
import ChartWeeklyPace from "@/components/ChartWeeklyPace";
import MonthlyTable from "@/components/MonthlyTable";
import ScenarioManager from "@/components/ScenarioManager";
import ScenarioComparison from "@/components/ScenarioComparison";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const { params, setParams, setParamsImmediate, result, scenarios, saveScenario, deleteScenario } =
    useSimulation();

  const [showComparison, setShowComparison] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card-bg)]/80 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg border border-[var(--border)] text-[var(--foreground)]"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="text-base font-bold text-[var(--foreground)]">
              D2C 売上シミュレーター
            </h1>
            <span className="hidden sm:inline text-xs text-[var(--muted)] bg-[var(--border)] px-2 py-0.5 rounded-full">
              {params.periodMonths}ヶ月シミュレーション
            </span>
          </div>

          <div className="flex items-center gap-2">
            {scenarios.length > 0 && (
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${
                  showComparison
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-[var(--card-bg)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-400"
                }`}
              >
                比較 ({scenarios.length})
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex relative">
        {/* Sidebar - mobile overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Panel - Parameter Controls */}
        <aside
          className={`
            fixed lg:sticky top-14 left-0 z-40 lg:z-auto
            w-[340px] lg:w-[380px] h-[calc(100vh-3.5rem)] overflow-y-auto
            border-r border-[var(--border)] bg-[var(--card-bg)]
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <ParameterPanel
            params={params}
            onChange={setParams}
            onChangeImmediate={setParamsImmediate}
          />
        </aside>

        {/* Main Dashboard */}
        <main className="flex-1 min-w-0 p-4 space-y-4 lg:ml-0">
          {/* Summary Cards */}
          <DashboardSummary result={result} params={params} />

          {/* Scenario comparison view */}
          {showComparison && scenarios.length > 0 && (
            <ScenarioComparison scenarios={scenarios} />
          )}

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ChartMonthly data={result.monthlyData} />
            <div className="space-y-4">
              <ChartWeeklyPace
                data={result.monthlyData}
                maxProductionCap={result.maxProductionCap}
              />
              <ChartChannelPie result={result} />
            </div>
          </div>

          {/* Monthly Table */}
          <MonthlyTable data={result.monthlyData} />

          {/* Scenario Manager */}
          <ScenarioManager
            scenarios={scenarios}
            onSave={saveScenario}
            onDelete={deleteScenario}
            canSave={scenarios.length < 3}
          />
        </main>
      </div>
    </div>
  );
}
