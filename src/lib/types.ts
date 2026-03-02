export type AwarenessCurve = "sigmoid" | "linear" | "exponential" | "event-boost";

export type ChannelKey = "direct" | "retail" | "ec" | "wholesale";

export interface ChannelDistribution {
  direct: number;
  retail: number;
  ec: number;
  wholesale: number;
}

export interface SimParams {
  // Product
  price: number;          // selling price per unit (JPY)
  cogs: number;           // cost of goods sold per unit (JPY)
  periodMonths: number;   // simulation period (3, 6, 12)

  // Goals
  targetProfit: number;   // target total profit (JPY)

  // Team / Manufacturing
  teamSize: number;       // number of team members
  productionPerPerson: number; // units per person per month
  weeklyProductionCap: number; // max units per week (manufacturing cap)

  // Awareness
  awarenessCurve: AwarenessCurve;

  // Channel distribution (must sum to 100)
  channels: ChannelDistribution;

  // Channel-specific margins (multiplier on base margin)
  channelMargins: ChannelDistribution;
}

export interface MonthlyData {
  month: number;           // 1-based
  label: string;           // e.g. "M1"
  awarenessFactor: number; // 0~1 awareness weight
  unitsSold: number;
  revenue: number;
  profit: number;
  cumulativeProfit: number;
  weeklyPace: number;      // avg units/week this month
  capacityExceeded: boolean;
  channelBreakdown: ChannelDistribution;
}

export interface SimResult {
  monthlyData: MonthlyData[];
  totalUnitsSold: number;
  totalRevenue: number;
  totalProfit: number;
  requiredUnits: number;       // units needed to reach targetProfit
  weeklyPaceRequired: number;  // required weekly pace
  dailyPaceRequired: number;   // required daily pace
  maxProductionCap: number;    // weekly cap from team
  achievabilityPct: number;    // (max possible profit / target profit) * 100, capped at 100
  capacityShortfall: boolean;  // any month exceeds cap
}

export interface Scenario {
  id: string;
  name: string;
  params: SimParams;
  result: SimResult;
  createdAt: number;
}
