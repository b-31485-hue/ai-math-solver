import type { Config, Layout, ScatterData } from "plotly.js";

export const PLOT_COLORS = {
  f: "#7ee8fa",
  derivative: "#fcd34d",
  integral: "#c4b5fd",
  area: "rgba(196, 181, 253, 0.28)",
  grid: "rgba(255, 255, 255, 0.07)",
  zero: "rgba(255, 255, 255, 0.22)",
} as const;

export function createPlotLayout(xRange: number, yRange: number): Partial<Layout> {
  return {
    autosize: true,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(8, 8, 20, 0.55)",
    font: {
      family: "Inter, system-ui, sans-serif",
      color: "rgba(230, 230, 245, 0.75)",
      size: 11,
    },
    margin: { l: 52, r: 20, t: 36, b: 44 },
    hovermode: "x unified",
    hoverlabel: {
      bgcolor: "rgba(12, 12, 28, 0.95)",
      bordercolor: "rgba(167, 139, 250, 0.45)",
      font: { color: "#f4f4ff", size: 12 },
    },
    legend: {
      orientation: "h",
      yanchor: "bottom",
      y: 1.02,
      x: 0,
      bgcolor: "rgba(0,0,0,0)",
      borderwidth: 0,
      font: { size: 11 },
    },
    xaxis: {
      title: { text: "x", standoff: 8 },
      range: [-xRange, xRange],
      gridcolor: PLOT_COLORS.grid,
      zerolinecolor: PLOT_COLORS.zero,
      tickfont: { size: 10 },
      linecolor: "rgba(255,255,255,0.12)",
    },
    yaxis: {
      title: { text: "y", standoff: 8 },
      range: [-yRange, yRange],
      gridcolor: PLOT_COLORS.grid,
      zerolinecolor: PLOT_COLORS.zero,
      tickfont: { size: 10 },
      linecolor: "rgba(255,255,255,0.12)",
    },
    transition: { duration: 400, easing: "cubic-in-out" },
  };
}

export function createPlotConfig(): Partial<Config> {
  return {
    responsive: true,
    displayModeBar: false,
    scrollZoom: true,
    doubleClick: "reset",
  };
}

export function lineTrace(
  curve: { x: number[]; y: number[] },
  name: string,
  color: string,
  dash?: "solid" | "dash" | "dot" | "dashdot",
): Partial<ScatterData> {
  return {
    type: "scatter",
    mode: "lines",
    x: curve.x,
    y: curve.y,
    name,
    line: {
      color,
      width: name === "f(x)" ? 2.8 : 2,
      dash: dash ?? "solid",
      shape: "spline",
    },
    connectgaps: false,
    hovertemplate: `<b>${name}</b><br>x = %{x:.3f}<br>y = %{y:.3f}<extra></extra>`,
  };
}
