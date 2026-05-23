import { evalTerms, type Term } from "@/lib/solver";
import type { PlotBounds, PlotTransform } from "./types";

export function createPlotTransform(
  width: number,
  height: number,
  padding: number,
  { xMin, xMax, yMin, yMax }: PlotBounds,
): PlotTransform {
  const x2px = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - padding * 2);
  const y2px = (y: number) =>
    height - padding - ((y - yMin) / (yMax - yMin)) * (height - padding * 2);
  const px2x = (px: number) => xMin + ((px - padding) / (width - padding * 2)) * (xMax - xMin);
  return { x2px, y2px, px2x };
}

export function buildSeriesPath(
  terms: Term[],
  {
    xMin,
    xMax,
    yMin,
    yMax,
    x2px,
    y2px,
    samples = 400,
    yClampMargin = 5,
  }: PlotBounds & PlotTransform & { samples?: number; yClampMargin?: number },
): string {
  let d = "";
  let pen = false;
  for (let i = 0; i <= samples; i++) {
    const x = xMin + ((xMax - xMin) * i) / samples;
    const y = evalTerms(terms, x);
    if (!isFinite(y) || y < yMin - 100 || y > yMax + 100) {
      pen = false;
      continue;
    }
    const px = x2px(x);
    const py = y2px(Math.max(yMin - yClampMargin, Math.min(yMax + yClampMargin, y)));
    d += pen ? ` L${px.toFixed(2)},${py.toFixed(2)}` : `M${px.toFixed(2)},${py.toFixed(2)}`;
    pen = true;
  }
  return d;
}

export function gridLines(bounds: PlotBounds) {
  const { xMin, xMax, yMin, yMax } = bounds;
  return {
    gridX: Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i),
    gridY: Array.from({ length: Math.floor((yMax - yMin) / 2) + 1 }, (_, i) => yMin + i * 2),
  };
}
