import type { SimParams, SimResult, MonthlyData, ChannelDistribution } from "./types";
import { getAwarenessWeights } from "./awareness";
import { WEEKS_PER_MONTH, WORKING_DAYS_PER_MONTH } from "./constants";

export function runSimulation(params: SimParams): SimResult {
  const {
    price,
    cogs,
    periodMonths,
    targetProfit,
    teamSize,
    productionPerPerson,
    weeklyProductionCap,
    awarenessCurve,
    channels,
    channelMargins,
    baseDemandMonthly,
    demandReferencePrice,
    priceElasticity,
  } = params;

  const baseMargin = price - cogs;
  const maxProductionCap = weeklyProductionCap; // units/week

  // Weighted average margin across channels
  const avgMarginMultiplier =
    (channels.direct * channelMargins.direct +
      channels.retail * channelMargins.retail +
      channels.ec * channelMargins.ec +
      channels.wholesale * channelMargins.wholesale) /
    100;

  const effectiveMargin = baseMargin * avgMarginMultiplier;

  // Required units to hit target profit
  const requiredUnits = effectiveMargin > 0 ? Math.ceil(targetProfit / effectiveMargin) : 0;

  // Weekly pace required
  const totalWeeks = periodMonths * WEEKS_PER_MONTH;
  const weeklyPaceRequired = requiredUnits / totalWeeks;
  const dailyPaceRequired = requiredUnits / (periodMonths * WORKING_DAYS_PER_MONTH);

  // Team production capacity
  const monthlyTeamCap = teamSize * productionPerPerson;
  const weeklyTeamCap = monthlyTeamCap / WEEKS_PER_MONTH;
  const effectiveWeeklyCap = Math.min(weeklyProductionCap, weeklyTeamCap);

  // Price elasticity of demand
  const elasticityEnabled = baseDemandMonthly > 0 && demandReferencePrice > 0;
  const effectiveDemandMonthly = elasticityEnabled
    ? baseDemandMonthly * Math.pow(price / demandReferencePrice, priceElasticity)
    : 0;
  const totalMarketDemand = elasticityEnabled ? effectiveDemandMonthly * periodMonths : Infinity;

  // Awareness weights
  const weights = getAwarenessWeights(awarenessCurve, periodMonths);

  // Distribute units by awareness
  const monthlyData: MonthlyData[] = weights.map((weight, i) => {
    const month = i + 1;
    const label = `M${month}`;

    const unitsSold = Math.round(requiredUnits * weight);

    const weeklyPace = unitsSold / WEEKS_PER_MONTH;
    const capacityExceeded = weeklyPace > maxProductionCap;

    // Channel breakdown (proportional)
    const channelBreakdown: ChannelDistribution = {
      direct: Math.round((unitsSold * channels.direct) / 100),
      retail: Math.round((unitsSold * channels.retail) / 100),
      ec: Math.round((unitsSold * channels.ec) / 100),
      wholesale: Math.round((unitsSold * channels.wholesale) / 100),
    };

    // Revenue and profit with channel-weighted margin
    const revenue = unitsSold * price;
    const profit = Math.round(unitsSold * effectiveMargin);

    return {
      month,
      label,
      awarenessFactor: weight,
      unitsSold,
      revenue,
      profit,
      cumulativeProfit: 0, // filled below
      weeklyPace,
      capacityExceeded,
      channelBreakdown,
    };
  });

  // Cumulative profit
  let cumulative = 0;
  for (const m of monthlyData) {
    cumulative += m.profit;
    m.cumulativeProfit = cumulative;
  }

  const totalUnitsSold = monthlyData.reduce((a, b) => a + b.unitsSold, 0);
  const totalRevenue = monthlyData.reduce((a, b) => a + b.revenue, 0);
  const totalProfit = monthlyData.reduce((a, b) => a + b.profit, 0);

  // Max possible profit (capped by manufacturing and/or market demand)
  const maxUnitsFromProduction = effectiveWeeklyCap * totalWeeks;
  const maxUnitsPerPeriod = Math.min(maxUnitsFromProduction, totalMarketDemand);
  const maxPossibleProfit = maxUnitsPerPeriod * effectiveMargin;
  const achievabilityPct = targetProfit > 0
    ? Math.min(100, Math.round((maxPossibleProfit / targetProfit) * 100))
    : 100;

  const capacityShortfall = monthlyData.some((m) => m.capacityExceeded);
  const demandLimited = elasticityEnabled && totalMarketDemand < maxUnitsFromProduction;

  return {
    monthlyData,
    totalUnitsSold,
    totalRevenue,
    totalProfit,
    requiredUnits,
    weeklyPaceRequired,
    dailyPaceRequired,
    maxProductionCap,
    achievabilityPct,
    capacityShortfall,
    effectiveDemandMonthly: elasticityEnabled ? Math.round(effectiveDemandMonthly) : 0,
    demandLimited,
  };
}
