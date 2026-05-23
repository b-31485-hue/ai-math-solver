import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { evalTerms } from "@/lib/solver";
import { buildSeriesPath, createPlotTransform, gridLines } from "./plot-utils";
import type { PlotBounds, PlotSeries } from "./types";

interface Props extends Partial<PlotBounds> {
  series: PlotSeries[];
  height?: number;
  showTangent?: boolean;
  showArea?: boolean;
  areaBounds?: [number, number];
  onAreaBoundsChange?: (b: [number, number]) => void;
}

export function InteractiveGraph({
  series,
  xMin = -6,
  xMax = 6,
  yMin = -10,
  yMax = 10,
  height = 480,
  showTangent = true,
  showArea = true,
  areaBounds = [-2, 2],
  onAreaBoundsChange,
}: Props) {
  const width = 960;
  const padding = 40;
  const svgRef = useRef<SVGSVGElement>(null);
  const bounds = useMemo(() => ({ xMin, xMax, yMin, yMax }), [xMin, xMax, yMin, yMax]);

  const transform = useMemo(
    () => createPlotTransform(width, height, padding, bounds),
    [bounds, height],
  );
  const { x2px, y2px, px2x } = transform;

  const [hoverX, setHoverX] = useState<number | null>(null);
  const [dragging, setDragging] = useState<null | "a" | "b">(null);
  const main = series[0];

  const paths = useMemo(
    () =>
      series.map((s) => ({
        ...s,
        d: buildSeriesPath(s.terms, { ...bounds, ...transform, samples: 600 }),
      })),
    [series, bounds, transform],
  );

  const areaPath = useMemo(() => {
    if (!showArea) return "";
    const [a0, b0] = areaBounds;
    const a = Math.min(a0, b0);
    const b = Math.max(a0, b0);
    const samples = 200;
    let d = `M${x2px(a).toFixed(2)},${y2px(0).toFixed(2)}`;
    for (let i = 0; i <= samples; i++) {
      const x = a + ((b - a) * i) / samples;
      const y = evalTerms(main.terms, x);
      const yc = Math.max(yMin, Math.min(yMax, y));
      d += ` L${x2px(x).toFixed(2)},${y2px(yc).toFixed(2)}`;
    }
    d += ` L${x2px(b).toFixed(2)},${y2px(0).toFixed(2)} Z`;
    return d;
  }, [showArea, areaBounds, main.terms, x2px, y2px, yMin, yMax]);

  const areaValue = useMemo(() => {
    if (!showArea) return 0;
    const [a0, b0] = areaBounds;
    const a = Math.min(a0, b0);
    const b = Math.max(a0, b0);
    const n = 400;
    const h = (b - a) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const x0 = a + i * h;
      const x1 = x0 + h;
      sum += (evalTerms(main.terms, x0) + evalTerms(main.terms, x1)) * 0.5 * h;
    }
    return sum;
  }, [showArea, areaBounds, main.terms]);

  const tangent = useMemo(() => {
    if (!showTangent || hoverX === null) return null;
    const f = (x: number) => evalTerms(main.terms, x);
    const eps = 1e-4;
    const slope = (f(hoverX + eps) - f(hoverX - eps)) / (2 * eps);
    const y0 = f(hoverX);
    if (!isFinite(slope) || !isFinite(y0)) return null;
    const span = (xMax - xMin) * 0.18;
    const x1 = hoverX - span;
    const x2 = hoverX + span;
    return {
      hoverX,
      y0,
      slope,
      x1,
      x2,
      yA: y0 + slope * (x1 - hoverX),
      yB: y0 + slope * (x2 - hoverX),
    };
  }, [showTangent, hoverX, main.terms, xMin, xMax]);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * width;
    const x = px2x(px);
    const clamped = Math.max(xMin, Math.min(xMax, x));
    if (dragging && onAreaBoundsChange) {
      const next: [number, number] = [...areaBounds];
      if (dragging === "a") next[0] = clamped;
      else next[1] = clamped;
      onAreaBoundsChange(next);
    } else {
      setHoverX(clamped);
    }
  };

  const { gridX, gridY } = gridLines(bounds);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl glass-strong p-3">
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-neon-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-neon-purple/20 blur-3xl" />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="relative w-full h-auto block touch-none select-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          setHoverX(null);
          setDragging(null);
        }}
        onPointerUp={() => setDragging(null)}
      >
        <defs>
          <linearGradient id="ig-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.7 0.27 295)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.7 0.27 295)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="ig-grid-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.6 0.1 270)" stopOpacity="0" />
            <stop offset="20%" stopColor="oklch(0.6 0.1 270)" stopOpacity="0.18" />
            <stop offset="80%" stopColor="oklch(0.6 0.1 270)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="oklch(0.6 0.1 270)" stopOpacity="0" />
          </linearGradient>
          {paths.map((p, i) => (
            <linearGradient key={`g-${i}`} id={`ig-line-${i}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={p.color} stopOpacity="1" />
              <stop offset="100%" stopColor={p.color} stopOpacity="0.65" />
            </linearGradient>
          ))}
          <filter id="ig-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ig-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g opacity="0.9">
          {gridX.map((x) => (
            <motion.line
              key={`gx-${x}`}
              x1={x2px(x)}
              x2={x2px(x)}
              y1={padding}
              y2={height - padding}
              stroke="url(#ig-grid-fade)"
              strokeWidth={x === 0 ? 0 : 1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.abs(x) * 0.02, duration: 0.4 }}
            />
          ))}
          {gridY.map((y) => (
            <motion.line
              key={`gy-${y}`}
              x1={padding}
              x2={width - padding}
              y1={y2px(y)}
              y2={y2px(y)}
              stroke="oklch(0.6 0.1 270 / 0.10)"
              strokeWidth={y === 0 ? 0 : 1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.abs(y) * 0.015, duration: 0.4 }}
            />
          ))}
        </g>

        <line
          x1={padding}
          x2={width - padding}
          y1={y2px(0)}
          y2={y2px(0)}
          stroke="oklch(0.85 0.04 270 / 0.45)"
        />
        <line
          x1={x2px(0)}
          x2={x2px(0)}
          y1={padding}
          y2={height - padding}
          stroke="oklch(0.85 0.04 270 / 0.45)"
        />

        {gridX
          .filter((x) => x !== 0 && x % 2 === 0)
          .map((x) => (
            <text
              key={`tx-${x}`}
              x={x2px(x)}
              y={y2px(0) + 14}
              fill="oklch(0.7 0.04 270 / 0.6)"
              fontSize="10"
              textAnchor="middle"
            >
              {x}
            </text>
          ))}
        {gridY
          .filter((y) => y !== 0)
          .map((y) => (
            <text
              key={`ty-${y}`}
              x={x2px(0) - 6}
              y={y2px(y) + 3}
              fill="oklch(0.7 0.04 270 / 0.6)"
              fontSize="10"
              textAnchor="end"
            >
              {y}
            </text>
          ))}

        {showArea && areaPath && (
          <motion.path
            d={areaPath}
            fill="url(#ig-area)"
            stroke="oklch(0.75 0.22 295 / 0.6)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}

        {paths.map((p, i) => (
          <motion.path
            key={`path-${i}-${p.label}`}
            d={p.d}
            fill="none"
            stroke={`url(#ig-line-${i})`}
            strokeWidth={i === 0 ? 2.6 : 2}
            strokeLinecap="round"
            strokeDasharray={i === 0 ? undefined : "5 5"}
            filter="url(#ig-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: i * 0.15 }}
          />
        ))}

        {showArea &&
          (["a", "b"] as const).map((k, idx) => {
            const xv = areaBounds[idx];
            return (
              <g key={k}>
                <line
                  x1={x2px(xv)}
                  x2={x2px(xv)}
                  y1={padding}
                  y2={height - padding}
                  stroke="oklch(0.75 0.22 295 / 0.7)"
                  strokeDasharray="2 4"
                />
                <circle
                  cx={x2px(xv)}
                  cy={y2px(0)}
                  r={8}
                  fill="oklch(0.7 0.27 295)"
                  filter="url(#ig-glow-strong)"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setDragging(k);
                  }}
                  style={{ cursor: "ew-resize" }}
                />
                <text
                  x={x2px(xv)}
                  y={padding - 8}
                  fill="oklch(0.9 0.05 295)"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {k} = {xv.toFixed(2)}
                </text>
              </g>
            );
          })}

        {tangent && (
          <g>
            <line
              x1={x2px(tangent.x1)}
              y1={y2px(Math.max(yMin, Math.min(yMax, tangent.yA)))}
              x2={x2px(tangent.x2)}
              y2={y2px(Math.max(yMin, Math.min(yMax, tangent.yB)))}
              stroke="oklch(0.85 0.18 60)"
              strokeWidth="2"
              filter="url(#ig-glow-strong)"
            />
            <line
              x1={x2px(tangent.hoverX)}
              x2={x2px(tangent.hoverX)}
              y1={padding}
              y2={height - padding}
              stroke="oklch(0.85 0.18 60 / 0.3)"
              strokeDasharray="3 4"
            />
            <circle
              cx={x2px(tangent.hoverX)}
              cy={y2px(Math.max(yMin, Math.min(yMax, tangent.y0)))}
              r={6}
              fill="oklch(0.95 0.15 60)"
              filter="url(#ig-glow-strong)"
            />
          </g>
        )}
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-2 pb-1 text-xs">
        <div className="flex flex-wrap gap-4">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-muted-foreground">
              <span
                className="inline-block h-2 w-4 rounded-full"
                style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
              />
              {s.label}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 font-mono">
          {tangent && (
            <span className="rounded-md border border-[oklch(0.85_0.18_60_/_0.4)] bg-[oklch(0.85_0.18_60_/_0.08)] px-2 py-1 text-[oklch(0.95_0.15_60)]">
              slope @ x={tangent.hoverX.toFixed(2)} · m = {tangent.slope.toFixed(3)}
            </span>
          )}
          {showArea && (
            <span className="rounded-md border border-neon-purple/40 bg-neon-purple/10 px-2 py-1 text-neon-purple">
              ∫ from {Math.min(areaBounds[0], areaBounds[1]).toFixed(2)} to{" "}
              {Math.max(areaBounds[0], areaBounds[1]).toFixed(2)} ≈ {areaValue.toFixed(3)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
