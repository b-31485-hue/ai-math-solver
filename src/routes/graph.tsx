import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { springNav } from "@/lib/motion";
import { useMemo, useState } from "react";
import { FunctionPlot } from "@/components/graph";
import { PLOT_COLORS } from "@/components/graph/plot-theme";
import { MathLatex } from "@/components/math/MathLatex";
import { GRAPH_PRESETS } from "@/config/navigation";
import { solve } from "@/lib/solver";
import { cn } from "@/lib/utils";
import { Activity, Sigma, Sparkles } from "lucide-react";

export const Route = createFileRoute("/graph")({
  head: () => ({
    meta: [
      { title: "Graph Lab — Calculus.ai" },
      {
        name: "description",
        content:
          "Interactive Plotly graph lab with f(x), derivative, integral overlays, area shading, and neon dark styling.",
      },
    ],
  }),
  component: GraphPage,
});

function GraphPage() {
  const reduce = useReducedMotion();
  const [expr, setExpr] = useState("x^3 - 3x");
  const [showD, setShowD] = useState(true);
  const [showI, setShowI] = useState(false);
  const [showArea, setShowArea] = useState(true);
  const [bounds, setBounds] = useState<[number, number]>([-1.5, 1.5]);
  const [xRange, setXRange] = useState(6);
  const [yRange, setYRange] = useState(10);

  const dResult = useMemo(() => solve(expr, "differentiate"), [expr]);
  const iResult = useMemo(() => solve(expr, "integrate"), [expr]);

  const plotKey = `${expr}-${showD}-${showI}-${showArea}-${bounds.join(",")}-${xRange}-${yRange}`;

  return (
    <main className="container-wide pb-16 sm:pb-24">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 sm:mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <SectionHeader
          eyebrow={
            <>
              <Sparkles className="h-3.5 w-3.5" /> Graph Lab
            </>
          }
          title={
            <>
              Visualize calculus in <span className="gradient-text">real time</span>
            </>
          }
          description="Plot f(x), f′(x), and ∫f(x)dx on one canvas. Pan, zoom, and watch curves draw in smoothly."
        />
          <div className="flex flex-wrap gap-2">
            {GRAPH_PRESETS.map((p) => {
              const active = expr === p.expr;
              return (
                <motion.button
                  key={p.label}
                  type="button"
                  onClick={() => setExpr(p.expr)}
                  whileHover={reduce ? undefined : { scale: 1.05, y: -1 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  className={cn(
                    "relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="graph-preset-pill"
                      className="absolute inset-0 rounded-full border border-white/[0.1] bg-white/[0.06]"
                      transition={springNav}
                    />
                  )}
                  <span className="relative">{p.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.header>

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FunctionPlot
              expr={expr}
              height={500}
              xRange={xRange}
              yRange={yRange}
              showDerivative={showD}
              showIntegral={showI}
              showArea={showArea}
              areaBounds={bounds}
              plotKey={plotKey}
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
              <ResultCard label="f(x)" tex={dResult.inputLatex} accent="oklch(0.85 0.16 200)" />
              <ResultCard label="f′(x)" tex={dResult.resultLatex} accent="oklch(0.78 0.2 60)" />
              <ResultCard
                label="∫ f(x) dx"
                tex={iResult.resultLatex}
                accent="oklch(0.7 0.27 295)"
              />
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-5 rounded-2xl glass-strong p-5"
          >
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Function
              </label>
              <div className="relative mt-2">
                <input
                  value={expr}
                  onChange={(e) => setExpr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-black/40 px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neon-purple/60"
                  spellCheck={false}
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Try <code className="text-neon-cyan">x^2</code>,{" "}
                <code className="text-neon-cyan">sin(x)</code>,{" "}
                <code className="text-neon-cyan">e^x</code>
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Layers
              </div>
              <ToggleRow
                label="f(x) — original"
                color={PLOT_COLORS.f}
                checked
                onChange={() => {}}
                disabled
              />
              <ToggleRow
                label="Derivative  f′(x)"
                icon={<Activity className="h-3.5 w-3.5" />}
                color="oklch(0.78 0.2 60)"
                checked={showD}
                onChange={setShowD}
              />
              <ToggleRow
                label="Integral  ∫f(x)dx"
                icon={<Sigma className="h-3.5 w-3.5" />}
                color="oklch(0.7 0.27 295)"
                checked={showI}
                onChange={setShowI}
              />
            </div>

            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Overlays
              </div>
              <ToggleRow
                label="Area shading"
                color="oklch(0.7 0.27 295)"
                checked={showArea}
                onChange={setShowArea}
              />
            </div>

            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Integration bounds
              </div>
              <Slider
                label={`a = ${bounds[0].toFixed(1)}`}
                value={bounds[0]}
                min={-xRange}
                max={xRange}
                step={0.1}
                onChange={(v) => setBounds([v, bounds[1]])}
              />
              <Slider
                label={`b = ${bounds[1].toFixed(1)}`}
                value={bounds[1]}
                min={-xRange}
                max={xRange}
                step={0.1}
                onChange={(v) => setBounds([bounds[0], v])}
              />
            </div>

            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Domain
              </div>
              <Slider
                label={`x · ±${xRange}`}
                value={xRange}
                min={2}
                max={20}
                onChange={setXRange}
              />
              <Slider
                label={`y · ±${yRange}`}
                value={yRange}
                min={4}
                max={40}
                onChange={setYRange}
              />
            </div>

            <div className="rounded-xl border border-dashed border-border bg-white/[0.02] p-3 text-[11px] leading-relaxed text-muted-foreground">
              <span className="text-neon-cyan">Tip:</span> scroll to zoom, drag to pan. Toggle
              layers to compare f, f′, and the antiderivative.
            </div>
          </motion.aside>
        </div>
    </main>
  );
}

function ResultCard({ label, tex, accent }: { label: string; tex: string; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-white/[0.03] p-3">
      <div
        className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl"
        style={{ background: accent, opacity: 0.18 }}
      />
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 overflow-x-auto">
        <MathLatex tex={tex} size="sm" />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  color,
  checked,
  onChange,
  icon,
  disabled,
}: {
  label: string;
  color: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className="group flex w-full items-center justify-between rounded-lg border border-transparent bg-white/[0.03] px-3 py-2 text-sm transition-all hover:border-white/10 hover:bg-white/[0.06] disabled:opacity-60"
    >
      <span className="flex items-center gap-2">
        <span
          className="h-2 w-4 rounded-full"
          style={{ background: color, boxShadow: checked ? `0 0 10px ${color}` : "none" }}
        />
        {icon}
        {label}
      </span>
      <span
        className={`relative h-4 w-7 rounded-full transition-colors ${checked ? "bg-neon-purple/80" : "bg-white/10"}`}
      >
        <span
          className={`absolute top-[1px] block h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-transform ${
            checked ? "translate-x-3" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1.5 w-full accent-[oklch(0.7_0.27_295)]"
      />
    </div>
  );
}
