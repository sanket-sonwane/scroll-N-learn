export type TraceKind =
  | "init"
  | "compare"
  | "update"
  | "found"
  | "miss"
  | "done";

export type TraceStep = {
  i: number;
  pointer: number;
  max: number | null;
  comparisons: number;
  kind: TraceKind;
  message: string;
};

export type ExecTrace = {
  steps: TraceStep[];
  result: number | null;
  found: boolean;
  comparisons: number;
};

type BuildInput = {
  algorithm: "findMax" | "linearSearch";
  array: number[];
  target?: number;
  flaw?: "zero-init";
};

export function buildTrace(input: BuildInput): ExecTrace {
  const { algorithm, flaw } = input;
  const array = input.array;
  const steps: TraceStep[] = [];
  let comparisons = 0;

  if (algorithm === "findMax") {
    const initialMax = flaw === "zero-init" ? 0 : array[0];
    steps.push({
      i: 0,
      pointer: 0,
      max: initialMax,
      comparisons: 0,
      kind: "init",
      message: flaw === "zero-init" ? "max = 0" : "max = a[0]",
    });
    let max = initialMax;
    for (let i = 1; i < array.length; i++) {
      comparisons += 1;
      const current = max;
      steps.push({
        i,
        pointer: i,
        max: current,
        comparisons,
        kind: "compare",
        message: `is ${array[i]} > ${max}?`,
      });
      if (array[i] > max) {
        max = array[i];
        steps.push({
          i,
          pointer: i,
          max,
          comparisons,
          kind: "update",
          message: `max = ${max}`,
        });
      }
    }
    steps.push({
      i: array.length - 1,
      pointer: -1,
      max,
      comparisons,
      kind: "done",
      message: `max = ${max}`,
    });
    return { steps, result: max, found: true, comparisons };
  }

  const target = input.target ?? 0;
  for (let i = 0; i < array.length; i++) {
    comparisons += 1;
    if (array[i] === target) {
      steps.push({
        i,
        pointer: i,
        max: target,
        comparisons,
        kind: "found",
        message: `a[${i}] = ${target} — found`,
      });
      return { steps, result: i, found: true, comparisons };
    }
    steps.push({
      i,
      pointer: i,
      max: null,
      comparisons,
      kind: "compare",
      message: `is a[${i}] = ${target}?  no`,
    });
  }
  steps.push({
    i: array.length - 1,
    pointer: -1,
    max: null,
    comparisons,
    kind: "miss",
    message: `${target} not present — scanned all ${array.length}`,
  });
  return { steps, result: null, found: false, comparisons };
}

/** For average-case linear search: insert target at a stable pseudo-random index. */
export function averageCaseArray(base: number[], seed: number): {
  array: number[];
  targetIndex: number;
} {
  const target = 42;
  const span = Math.max(base.length, 1);
  const idx = Math.floor(((seed * 2654435761) % 100000) / 100000 * span);
  const array = [...base];
  array[idx] = target;
  return { array, targetIndex: idx };
}