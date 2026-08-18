import type { GrowthFn } from "@/lib/content/types";

export function growthValue(fn: GrowthFn, n: number): number {
  const x = Math.max(1, n);
  switch (fn) {
    case "constant":
      return 1;
    case "log":
      return Math.log2(x + 1);
    case "linear":
      return x;
    case "nlogn":
      return x * Math.log2(x + 1);
    case "quadratic":
      return x * x;
    case "exponential":
      return Math.pow(2, x);
    case "factorial":
      return factorial(x);
  }
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  // Stirling approximation to avoid overflow; exact below 22.
  if (n < 22) {
    let v = 1;
    for (let i = 2; i <= Math.floor(n); i++) v *= i;
    return v;
  }
  const x = n / Math.E;
  return Math.sqrt(2 * Math.PI * n) * Math.pow(x, n) * Math.exp(1 / (12 * n));
}

export const GROWTH_LABELS: Record<GrowthFn, string> = {
  constant: "O(1)",
  log: "O(log n)",
  linear: "O(n)",
  nlogn: "O(n log n)",
  quadratic: "O(n²)",
  exponential: "O(2ⁿ)",
  factorial: "O(n!)",
};

export const GROWTH_COLORS: Record<GrowthFn, string> = {
  constant: "#8b93a3",
  log: "#34d399",
  linear: "#5b9bff",
  nlogn: "#7dd3fc",
  quadratic: "#f5b544",
  exponential: "#f87171",
  factorial: "#fca5a5",
};

/** Functions excluded from the reference ceiling because they explode. */
export const EXPLOSIVE: GrowthFn[] = ["exponential", "factorial"];

export function isExplosive(fn: GrowthFn): boolean {
  return EXPLOSIVE.includes(fn);
}

export function formatOps(v: number): string {
  if (v >= 1e12) return `${(v / 1e12).toFixed(1)}T`;
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return Math.round(v).toString();
}
export function formatN(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e9 ? 0 : 1)}M`;
  if (n >= 1e4) return n.toLocaleString();
  if (n >= 1000) return n.toLocaleString();
  return String(n);
}

/** log10 of the operation count, computed in log-space to avoid overflow. */
export function growthLog10(fn: GrowthFn, n: number): number {
  const x = Math.max(1, n);
  switch (fn) {
    case "constant":
      return 0;
    case "log":
      return Math.log10(Math.log2(x + 1));
    case "linear":
      return Math.log10(x);
    case "nlogn":
      return Math.log10(x) + Math.log10(Math.log2(x + 1));
    case "quadratic":
      return 2 * Math.log10(x);
    case "exponential":
      return x * Math.log10(2);
    case "factorial": {
      let s = 0;
      for (let k = 2; k <= Math.floor(x); k++) s += Math.log10(k);
      return s;
    }
  }
}