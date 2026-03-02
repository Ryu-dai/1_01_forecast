import type { SimParams } from "./types";

export const DEFAULT_PARAMS: SimParams = {
  price: 5000,
  cogs: 1500,
  periodMonths: 6,
  targetProfit: 3000000,
  teamSize: 3,
  productionPerPerson: 100,
  weeklyProductionCap: 75,
  awarenessCurve: "sigmoid",
  channels: {
    direct: 40,
    retail: 20,
    ec: 30,
    wholesale: 10,
  },
  channelMargins: {
    direct: 1.0,
    retail: 0.8,
    ec: 0.9,
    wholesale: 0.6,
  },
  baseDemandMonthly: 0,
  demandReferencePrice: 5000,
  priceElasticity: -1.0,
};

export const PARAM_RANGES = {
  price: { min: 500, max: 50000, step: 100 },
  cogs: { min: 100, max: 30000, step: 100 },
  periodMonths: { options: [3, 6, 12] as const },
  targetProfit: { min: 100000, max: 50000000, step: 100000 },
  teamSize: { min: 1, max: 20, step: 1 },
  productionPerPerson: { min: 10, max: 500, step: 10 },
  weeklyProductionCap: { min: 10, max: 2000, step: 10 },
  baseDemandMonthly: { min: 10, max: 5000, step: 10 },
  priceElasticity: { min: -3.0, max: -0.1, step: 0.1 },
};

export const CHANNEL_LABELS: Record<string, string> = {
  direct: "直販",
  retail: "小売",
  ec: "EC",
  wholesale: "卸売",
};

export const CHANNEL_COLORS: Record<string, string> = {
  direct: "#6366f1",
  retail: "#22c55e",
  ec: "#f59e0b",
  wholesale: "#ec4899",
};

export const AWARENESS_LABELS: Record<string, string> = {
  sigmoid: "S字カーブ",
  linear: "線形",
  exponential: "指数",
  "event-boost": "イベントブースト",
};

export const WEEKS_PER_MONTH = 4.33;
export const WORKING_DAYS_PER_MONTH = 22;
