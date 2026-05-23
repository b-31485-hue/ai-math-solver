import { useMemo } from "react";
import { buildSeriesPath, createPlotTransform, gridLines } from "./plot-utils";
import type { PlotBounds, PlotSeries } from "./types";

interface Props extends Partial<PlotBounds> {
  series: PlotSeries[];
  height?: number;
}

export function GraphPlot({
  series,
  xMin = -6,
  xMax = 6,
  yMin = -10,
  yMax = 10,
  height = 360,
}: Props) {
  const width = 720;
  const padding = 32;
  const bounds = useMemo(() => ({ xMin, xMax, yMin, yMax }), [xMin, xMax, yMin, yMax]);
  const transform = useMemo(
    () => createPlotTransform(width, height, padding, bounds),
    [bounds, height],
  );
  const { x2px, y2px } = transform;

  const paths = useMemo(
    () =>
      series.map((s) => ({
        ...s,
        d: buildSeriesPath(s.terms, { ...bounds, ...transform, samples: 400 }),
      })),
    [series, bounds, transform],
  );

  const { gridX, gridY } = gridLines(bounds);

  return (
    <div className="w-full overflow-hidden rounded-2xl glass p-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block">
        <defs>
          {paths.map((p, i) => (
            <linearGradient key={i} id={`grad-${i}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={p.color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={p.color} stopOpacity="0.5" />
            </linearGradient>
          ))}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridX.map((x) => (
          <line
            key={`gx${x}`}
            x1={x2px(x)}
            x2={x2px(x)}
            y1={padding}
            y2={height - padding}
            stroke="oklch(0.6 0.1 270 / 0.08)"
          />
        ))}
        {gridY.map((y) => (
          <line
            key={`gy${y}`}
            x1={padding}
            x2={width - padding}
            y1={y2px(y)}
            y2={y2px(y)}
            stroke="oklch(0.6 0.1 270 / 0.08)"
          />
        ))}

        <line
          x1={padding}
          x2={width - padding}
          y1={y2px(0)}
          y2={y2px(0)}
          stroke="oklch(0.7 0.04 270 / 0.5)"
          strokeWidth="1"
        />
        <line
          x1={x2px(0)}
          x2={x2px(0)}
          y1={padding}
          y2={height - padding}
          stroke="oklch(0.7 0.04 270 / 0.5)"
          strokeWidth="1"
        />

        {paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke={`url(#grad-${i})`}
            strokeWidth="2.2"
            strokeLinecap="round"
            filter="url(#glow)"
          />
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 px-2 pb-1 text-xs text-muted-foreground">
        {series.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-4 rounded-full"
              style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
            />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
