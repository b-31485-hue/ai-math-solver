import { FunctionSquare, LineChart, Sparkles, type LucideIcon } from "lucide-react";

export const APP_ROUTES = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Solver" },
  { to: "/tutor", label: "AI Tutor" },
  { to: "/graph", label: "Graph" },
] as const;

export const WORKSPACE_NAV: {
  icon: LucideIcon;
  label: string;
  to: "/dashboard" | "/tutor" | "/graph";
}[] = [
  { icon: FunctionSquare, label: "Solver", to: "/dashboard" },
  { icon: Sparkles, label: "AI Tutor", to: "/tutor" },
  { icon: LineChart, label: "Graph Lab", to: "/graph" },
];

export const SOLVER_EXAMPLES = [
  "3x^3 + 2x^2 - 5x + 7",
  "sin(x) + cos(x)",
  "e^x + ln(x)",
  "x^4 - 2x^2 + 1",
] as const;

export const WORKSPACE_HISTORY = [
  { label: "3x³ + 2x² − 5x + 7", mode: "d/dx" },
  { label: "sin(x) + cos(x)", mode: "∫ dx" },
  { label: "e^x + ln(x)", mode: "d/dx" },
  { label: "x⁴ − 2x² + 1", mode: "∫ dx" },
] as const;

export const GRAPH_PRESETS = [
  { label: "Cubic", expr: "x^3 - 3x" },
  { label: "Sine wave", expr: "sin(x)" },
  { label: "Quartic well", expr: "x^4 - 4x^2" },
  { label: "Exp decay", expr: "e^x" },
  { label: "Parabola", expr: "x^2" },
] as const;
