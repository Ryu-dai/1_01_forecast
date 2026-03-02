import type { AwarenessCurve } from "./types";

function normalize(arr: number[]): number[] {
  const sum = arr.reduce((a, b) => a + b, 0);
  if (sum === 0) return arr.map(() => 1 / arr.length);
  return arr.map((v) => v / sum);
}

function sigmoid(n: number): number[] {
  const mid = (n - 1) / 2;
  const raw = Array.from({ length: n }, (_, i) => 1 / (1 + Math.exp(-(i - mid) * 1.5)));
  return normalize(raw);
}

function linear(n: number): number[] {
  const raw = Array.from({ length: n }, (_, i) => i + 1);
  return normalize(raw);
}

function exponential(n: number): number[] {
  const raw = Array.from({ length: n }, (_, i) => Math.exp((i + 1) * 0.5));
  return normalize(raw);
}

function eventBoost(n: number): number[] {
  const base = sigmoid(n);
  const boosted = base.map((v, i) => (i === n - 1 ? v * 1.5 : v));
  return normalize(boosted);
}

export function getAwarenessWeights(curve: AwarenessCurve, n: number): number[] {
  switch (curve) {
    case "sigmoid":
      return sigmoid(n);
    case "linear":
      return linear(n);
    case "exponential":
      return exponential(n);
    case "event-boost":
      return eventBoost(n);
    default:
      return sigmoid(n);
  }
}

/** Returns sparkline path data (SVG) for a given curve, normalized to viewBox */
export function getSparklinePath(
  curve: AwarenessCurve,
  n: number,
  width: number,
  height: number
): string {
  const weights = getAwarenessWeights(curve, n);
  const max = Math.max(...weights);
  const points = weights.map((w, i) => {
    const x = (i / (n - 1)) * width;
    const y = height - (w / max) * height;
    return `${x},${y}`;
  });
  return `M ${points.join(" L ")}`;
}
