"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import type { SimParams, Scenario } from "./types";
import { DEFAULT_PARAMS } from "./constants";
import { runSimulation } from "./calc";

export function useSimulation() {
  const [params, setParamsState] = useState<SimParams>(DEFAULT_PARAMS);
  const [debouncedParams, setDebouncedParams] = useState<SimParams>(DEFAULT_PARAMS);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const setParams = useCallback((updater: SimParams | ((prev: SimParams) => SimParams)) => {
    setParamsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      // Debounce the simulation update
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setDebouncedParams(next);
      }, 150);
      return next;
    });
  }, []);

  const setParamsImmediate = useCallback((updater: SimParams | ((prev: SimParams) => SimParams)) => {
    setParamsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setDebouncedParams(next);
      return next;
    });
  }, []);

  const result = useMemo(() => runSimulation(debouncedParams), [debouncedParams]);

  const saveScenario = useCallback((name: string) => {
    if (scenarios.length >= 3) return;
    const scenario: Scenario = {
      id: crypto.randomUUID(),
      name,
      params: { ...params },
      result,
      createdAt: Date.now(),
    };
    setScenarios((prev) => [...prev, scenario]);
  }, [scenarios.length, params, result]);

  const deleteScenario = useCallback((id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    params,
    setParams,
    setParamsImmediate,
    result,
    scenarios,
    saveScenario,
    deleteScenario,
  };
}
