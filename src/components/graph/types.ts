import type { Term } from "@/lib/solver";

export interface PlotSeries {
  label: string;
  terms: Term[];
  color: string;
}

export interface PlotBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface PlotTransform {
  x2px: (x: number) => number;
  y2px: (y: number) => number;
  px2x: (px: number) => number;
}
