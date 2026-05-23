import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Cpu, Layers, LineChart, Play, Sigma, Wand2, Zap } from "lucide-react";
import { GlowCard, SectionCard, TutorPanel, WorkspaceSidebar } from "@/components/dashboard";
import { FunctionPlot } from "@/components/graph";
import { EquationTransition } from "@/components/motion";
import { MathLatex } from "@/components/math/MathLatex";
import { ModeToggle } from "@/components/math/ModeToggle";
import { SolverError } from "@/components/math/SolverError";
import { SolverLoader } from "@/components/math/SolverLoader";
import { StepByStepSolution } from "@/components/math/StepByStepSolution";
import { SOLVER_EXAMPLES } from "@/config/navigation";
import { useCalculusTutor } from "@/hooks/use-calculus-tutor";
import { useMathSolver } from "@/hooks/use-math-solver";
import { checkMathApiHealth } from "@/lib/math-api";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Solver Dashboard — Calculus.ai" },
      {
        name: "description",
        content:
          "Differentiate and integrate expressions step-by-step with live graphs and an AI tutor.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const { expr, setExpr, mode, setMode, loading, error, result, solveNow, clearError } =
    useMathSolver();

  const tutor = useCalculusTutor({
    expr,
    mode,
    detectedRules: result?.detectedRules,
    thinkMs: 450,
  });

  useEffect(() => {
    checkMathApiHealth().then(setApiOnline);
  }, []);

  return (
    <main className="container-wide pb-12 sm:pb-16 -mt-2">
      <div className="flex gap-3 sm:gap-4 items-stretch min-h-[calc(100vh-6.5rem)]">
          <WorkspaceSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          <div className="flex-1 min-w-0 surface-elevated overflow-hidden">
            <ResizablePanelGroup orientation="horizontal" className="h-full min-h-[760px]">
              <ResizablePanel defaultSize={62} minSize={38} className="!overflow-visible">
                <div className="h-full overflow-y-auto p-5 sm:p-8 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">
                        <Cpu className="h-3 w-3" /> Workspace
                      </p>
                      <h1 className="mt-2 text-2xl sm:text-[1.75rem] font-semibold tracking-[-0.03em]">
                        Solver
                      </h1>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          apiOnline === false
                            ? "bg-destructive"
                            : apiOnline
                              ? "bg-neon-cyan animate-pulse-glow"
                              : "bg-muted-foreground"
                        }`}
                      />
                      {apiOnline === false
                        ? "Backend offline"
                        : apiOnline
                          ? "SymPy engine online"
                          : "Checking engine…"}
                    </div>
                  </div>

                  <GlowCard>
                    <div className="p-5">
                      <label className="eyebrow !text-muted-foreground">Expression f(x)</label>
                      <div className="mt-3 flex items-center gap-2 input-saas !py-0 !px-0 overflow-hidden">
                        <Sigma className="h-4 w-4 text-muted-foreground shrink-0 ml-4" strokeWidth={1.75} />
                        <input
                          value={expr}
                          onChange={(e) => setExpr(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && solveNow()}
                          placeholder="e.g. 3x^3 + 2x^2 - 5x + 7"
                          className="flex-1 bg-transparent border-0 font-mono text-sm focus:outline-none focus:ring-0 min-w-0 py-3 pr-4 shadow-none placeholder:text-muted-foreground/50"
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <ModeToggle mode={mode} onChange={setMode} disabled={loading} />
                        <button
                          type="button"
                          onClick={solveNow}
                          disabled={loading}
                          className="group inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                          style={{
                            background: "var(--gradient-primary)",
                            boxShadow: "var(--shadow-glow-sm)",
                          }}
                        >
                          <Play className={`h-3.5 w-3.5 ${loading ? "animate-pulse" : ""}`} />
                          {loading ? "Solving…" : "Solve"}
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <span className="text-xs text-muted-foreground mr-1 self-center">Try:</span>
                        {SOLVER_EXAMPLES.map((e) => (
                          <button
                            key={e}
                            type="button"
                            onClick={() => setExpr(e)}
                            className="badge hover:bg-white/[0.06] hover:text-foreground transition-colors"
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  </GlowCard>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                      >
                        <SolverError message={error} onRetry={solveNow} onDismiss={clearError} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {loading && !result ? (
                    <SolverLoader />
                  ) : result ? (
                    <>
                      <motion.div layout className="grid gap-3 sm:grid-cols-2">
                        <div className="surface rounded-xl p-4 sm:p-5 relative">
                          {loading && (
                            <div className="absolute inset-0 z-10 rounded-2xl bg-background/60 backdrop-blur-sm flex items-center justify-center">
                              <SolverLoader label="Updating…" />
                            </div>
                          )}
                          <div className="eyebrow !text-muted-foreground mb-2">Input</div>
                          <EquationTransition equationKey={`in-${expr}-${mode}`}>
                            <div className="overflow-x-auto">
                              <MathLatex tex={result.inputLatex} size="lg" />
                            </div>
                          </EquationTransition>
                        </div>
                        <div className="relative surface-elevated rounded-xl p-4 sm:p-5 overflow-hidden">
                          {loading && (
                            <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                              <SolverLoader label="Updating…" />
                            </div>
                          )}
                          <div className="relative">
                            <div className="eyebrow !text-muted-foreground mb-2">
                              {mode === "differentiate" ? "f'(x)" : "∫ f(x) dx"}
                            </div>
                            <EquationTransition equationKey={`out-${expr}-${mode}-${result.resultLatex}`}>
                              <div className="overflow-x-auto">
                                <MathLatex tex={result.resultLatex} size="lg" glow />
                              </div>
                            </EquationTransition>
                          </div>
                        </div>
                      </motion.div>

                      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                        <SectionCard icon={Zap} title="Step-by-step solution">
                          <StepByStepSolution
                            steps={result.steps}
                            solutionKey={`${expr}-${mode}-${result.source}`}
                          />
                        </SectionCard>

                        <SectionCard icon={Layers} title="Detected rules">
                          <ul className="space-y-1.5">
                            {result.detectedRules.map((r, i) => (
                              <motion.li
                                key={r}
                                initial={{ opacity: 0, x: 6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="flex items-center gap-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors px-3 py-2 text-sm"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-neon-purple shadow-[0_0_8px_oklch(0.7_0.27_295)] animate-pulse-glow" />
                                {r}
                              </motion.li>
                            ))}
                          </ul>
                          <div className="mt-4 rounded-xl border border-dashed border-border/70 p-3 text-xs text-muted-foreground leading-relaxed">
                            <Wand2 className="inline h-3 w-3 mr-1 text-neon-cyan" />
                            {result.source === "api"
                              ? "Powered by your FastAPI + SymPy backend."
                              : "Offline fallback — start uvicorn for live SymPy results."}
                          </div>
                        </SectionCard>
                      </div>

                  <SectionCard icon={LineChart} title="Graph visualization" eyebrow="Live">
                    <FunctionPlot
                      expr={expr}
                      height={320}
                      xRange={6}
                      yRange={10}
                      showDerivative
                      showIntegral={mode === "integrate"}
                      showArea={mode === "integrate"}
                      areaBounds={[-2, 2]}
                      plotKey={`dash-${expr}-${mode}`}
                    />
                  </SectionCard>
                    </>
                  ) : null}
                </div>
              </ResizablePanel>

              <ResizableHandle className="!w-px bg-border/60 hover:bg-neon-purple/50 transition-colors" />

              <ResizablePanel defaultSize={38} minSize={26} maxSize={55}>
                <TutorPanel
                  messages={tutor.messages}
                  input={tutor.input}
                  setInput={tutor.setInput}
                  onSend={tutor.send}
                  onAsk={tutor.ask}
                  thinking={tutor.thinking}
                  suggestions={tutor.suggestions}
                  compact
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
      </div>
    </main>
  );
}
