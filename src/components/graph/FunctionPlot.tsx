import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import type { Data, Layout, PlotlyHTMLElement } from "plotly.js";
import { motion } from "framer-motion";
import { SolverLoader } from "@/components/math/SolverLoader";
import { curvesFromExpression, sampleAreaUnderCurve } from "@/lib/plot-sampling";
import { parse } from "@/lib/solver";
import { buildDrawFrames } from "./plot-animation";
import { createPlotConfig, createPlotLayout, lineTrace, PLOT_COLORS } from "./plot-theme";

const Plot = lazy(() => import("react-plotly.js"));

export interface FunctionPlotProps {
  expr: string;
  xRange?: number;
  yRange?: number;
  height?: number | string;
  showDerivative?: boolean;
  showIntegral?: boolean;
  showArea?: boolean;
  areaBounds?: [number, number];
  plotKey?: string;
}

function FunctionPlotInner({
  expr,
  xRange = 6,
  yRange = 10,
  height = 500,
  showDerivative = true,
  showIntegral = false,
  showArea = true,
  areaBounds = [-1.5, 1.5],
  plotKey = "",
}: FunctionPlotProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const xMin = -xRange;
  const xMax = xRange;

  const { data, layout, frames } = useMemo(() => {
    const { f, derivative, integral } = curvesFromExpression(expr, xMin, xMax, {
      derivative: showDerivative,
      integral: showIntegral,
    });

    const traces: Partial<Data>[] = [];

    if (showArea && f.x.length > 1) {
      const [a, b] = areaBounds;
      const area = sampleAreaUnderCurve(parse(expr), a, b);
      traces.push({
        type: "scatter",
        mode: "lines",
        x: area.x,
        y: area.y,
        fill: "toself",
        fillcolor: PLOT_COLORS.area,
        line: { width: 0, color: "rgba(0,0,0,0)" },
        name: "∫ area",
        hoverinfo: "skip",
        showlegend: false,
      });
    }

    if (f.x.length) traces.push(lineTrace(f, "f(x)", PLOT_COLORS.f));
    if (showDerivative && derivative?.x.length)
      traces.push(lineTrace(derivative, "f′(x)", PLOT_COLORS.derivative, "dash"));
    if (showIntegral && integral?.x.length)
      traces.push(lineTrace(integral, "∫ f(x) dx", PLOT_COLORS.integral, "dot"));

    const plotLayout: Partial<Layout> = {
      ...createPlotLayout(xRange, yRange),
      uirevision: `${expr}-${showDerivative}-${showIntegral}-${plotKey}`,
    };

    const { frames: drawFrames } = buildDrawFrames(traces);

    return { data: traces, layout: plotLayout, frames: drawFrames };
  }, [expr, xMin, xMax, xRange, yRange, showDerivative, showIntegral, showArea, areaBounds, plotKey]);

  const playDrawAnimation = useCallback(
    async (_figure: unknown, graphDiv: PlotlyHTMLElement) => {
      if (!frames.length) return;
      const Plotly = await import("plotly.js");
      await Plotly.animate(graphDiv, frames, {
        frame: { duration: 36, redraw: true },
        transition: { duration: 0 },
        mode: "immediate",
      });
    },
    [frames],
  );

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl glass-strong border border-border/60"
        style={{ height }}
      >
        <SolverLoader label="Preparing graph…" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden rounded-2xl glass-strong p-2 sm:p-3 border border-border/60"
      style={{ minHeight: typeof height === "number" ? height : undefined }}
    >
      <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-neon-blue/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-neon-purple/15 blur-3xl" />

      <Plot
        key={`${plotKey}-${expr}-${showDerivative}-${showIntegral}`}
        data={data}
        layout={layout}
        frames={frames}
        config={createPlotConfig()}
        style={{ width: "100%", height }}
        useResizeHandler
        className="relative z-[1] function-plot"
        onInitialized={playDrawAnimation}
      />
    </motion.div>
  );
}

export function FunctionPlot(props: FunctionPlotProps) {
  const h = props.height ?? 500;
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center rounded-2xl glass-strong border border-border/60"
          style={{ height: h }}
        >
          <SolverLoader label="Loading graph engine…" />
        </div>
      }
    >
      <FunctionPlotInner {...props} />
    </Suspense>
  );
}
