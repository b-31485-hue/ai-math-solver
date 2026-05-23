import { evalTerms, parse, solve, type Term } from "@/lib/solver";

export interface SampledCurve {
  x: number[];
  y: number[];
}

const SAMPLE_COUNT = 512;

export function sampleTerms(
  terms: Term[],
  xMin: number,
  xMax: number,
  count = SAMPLE_COUNT,
): SampledCurve {
  const x: number[] = [];
  const y: number[] = [];
  const step = (xMax - xMin) / (count - 1);

  for (let i = 0; i < count; i++) {
    const xv = xMin + i * step;
    const yv = evalTerms(terms, xv);
    if (Number.isFinite(yv)) {
      x.push(xv);
      y.push(yv);
    }
  }

  return { x, y };
}

export function sampleExpression(expr: string, xMin: number, xMax: number): SampledCurve {
  try {
    return sampleTerms(parse(expr), xMin, xMax);
  } catch {
    return { x: [], y: [] };
  }
}

export function curvesFromExpression(
  expr: string,
  xMin: number,
  xMax: number,
  options: { derivative?: boolean; integral?: boolean },
) {
  const fTerms = parse(expr);
  const f = sampleTerms(fTerms, xMin, xMax);

  let derivative: SampledCurve | null = null;
  let integral: SampledCurve | null = null;

  if (options.derivative) {
    try {
      const d = solve(expr, "differentiate");
      const dInput = d.resultLatex.replace(/\\.*?\{|\}|\+\s*C/g, "");
      derivative = sampleTerms(parse(dInput), xMin, xMax);
    } catch {
      derivative = { x: [], y: [] };
    }
  }

  if (options.integral) {
    try {
      const i = solve(expr, "integrate");
      const iInput = i.resultLatex.replace(/\\.*?\{|\}|\+\s*C/g, "");
      integral = sampleTerms(parse(iInput), xMin, xMax);
    } catch {
      integral = { x: [], y: [] };
    }
  }

  return { f, derivative, integral };
}

export function sampleAreaUnderCurve(
  terms: Term[],
  a: number,
  b: number,
  samples = 120,
): SampledCurve {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const x: number[] = [];
  const y: number[] = [];
  const step = (hi - lo) / samples;

  for (let i = 0; i <= samples; i++) {
    const xv = lo + i * step;
    x.push(xv);
    y.push(evalTerms(terms, xv));
  }
  // close to x-axis
  x.push(hi, lo);
  y.push(0, 0);

  return { x, y };
}
