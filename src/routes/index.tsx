import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, LineChart, Wand2, Quote, Cpu } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EquationTransition, MotionCard, Reveal, ShimmerButton, StaggerGrid } from "@/components/motion";
import { fadeUp } from "@/lib/motion";
import { GraphPlot } from "@/components/graph";
import { Footer } from "@/components/landing/Footer";
import { FloatingEquations } from "@/components/landing/FloatingEquations";
import { Particles } from "@/components/landing/Particles";
import { MathLatex } from "@/components/math/MathLatex";
import { parse } from "@/lib/solver";
import { useMemo, useState } from "react";
import { useMathSolver } from "@/hooks/use-math-solver";
import { ModeToggle } from "@/components/math/ModeToggle";
import { SolverError } from "@/components/math/SolverError";
import { SolverLoader } from "@/components/math/SolverLoader";
import { StepByStepSolution } from "@/components/math/StepByStepSolution";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calculus.ai — AI Calculus Solver, Tutor & Grapher" },
      {
        name: "description",
        content:
          "Premium AI calculus platform for differentiation and integration. Step-by-step solving, AI tutor, and live graph visualization.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative">
      <Hero />
      <Features />
      <InteractiveDemo />
      <TutorPreview />
      <GraphPreview />
      <Testimonials />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden section-saas pt-8 sm:pt-12">
      <FloatingEquations count={10} />
      <Particles count={24} />

      <div className="container-saas relative max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 badge mb-8"
        >
          <span className="badge-accent">
            <Cpu className="h-3 w-3" /> New
          </span>
          <span>AI-native calculus engine</span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="display-hero text-balance"
        >
          <span className="block text-foreground">Differentiation.</span>
          <span className="block text-foreground">Integration.</span>
          <span className="block gradient-text animate-gradient-text">Solved by AI.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.12 }}
          className="lead lead-center mt-7 max-w-lg"
        >
          The calculus workspace for students and engineers — step-by-step derivations, a patient
          tutor, and live graphs in one polished product.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.24 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <ShimmerButton to="/dashboard">
            Open the Solver <ArrowRight className="h-4 w-4" />
          </ShimmerButton>
          <ShimmerButton to="/tutor" variant="glass">
            <Sparkles className="h-4 w-4 text-neon-cyan" />
            Meet the AI Tutor
          </ShimmerButton>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan/80" />
            Real-time solving
          </span>
          <span className="hidden sm:inline h-3 w-px bg-white/10" />
          <span>12+ rule engines</span>
          <span className="hidden sm:inline h-3 w-px bg-white/10" />
          <span>SymPy-powered</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 sm:mt-20 max-w-3xl"
        >
          <div className="gradient-border">
            <div className="surface-elevated p-6 sm:p-8 text-left">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-neon-purple/70" />
                    <span className="h-2 w-2 rounded-full bg-neon-blue/70" />
                    <span className="h-2 w-2 rounded-full bg-neon-cyan/70" />
                  </div>
                  <span className="font-mono text-muted-foreground">solve.derivative</span>
                </div>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulse-glow" />
                  live
                </span>
              </div>
              <div className="mt-5 flex flex-col gap-4 text-left">
                <div className="rounded-lg bg-black/40 border border-white/[0.06] p-4 font-mono text-sm text-foreground/90">
                  <span className="text-muted-foreground">f(x) = </span>3x^3 + 2x^2 - 5x + 7
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="badge-accent text-[10px]">
                    Power Rule
                  </span>
                  <MathLatex tex={`\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}`} size="base" />
                </div>
                <div className="rounded-lg p-4 border border-white/[0.08] bg-white/[0.03]">
                  <div className="eyebrow !text-muted-foreground mb-2">Result</div>
                  <EquationTransition equationKey="hero-result">
                    <div className="text-2xl">
                      <MathLatex tex={`f'(x) = 9x^{2} + 4x - 5`} size="lg" glow />
                    </div>
                  </EquationTransition>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: Wand2,
    title: "Symbolic Solver",
    desc: "Differentiate or integrate any expression with crisp, rule-by-rule explanations.",
  },
  {
    icon: Brain,
    title: "AI Calculus Tutor",
    desc: "Ask questions in plain English. Get reasoning, not just answers.",
  },
  {
    icon: LineChart,
    title: "Live Visualization",
    desc: "See f(x), f'(x), and ∫f(x) overlay in a single fluid graph.",
  },
  {
    icon: Sparkles,
    title: "Rule Detection",
    desc: "Automatically detects power, chain, product, trig, and exponential rules.",
  },
];

function Features() {
  return (
    <section className="section-saas border-t border-white/[0.04]">
      <div className="container-wide">
        <Reveal>
          <SectionHeader
            eyebrow="Platform"
            title="Built for calculus, beautifully."
            description='Every feature is engineered for clarity, speed, and that quiet feeling of "I finally get it."'
          />
        </Reveal>

        <StaggerGrid className="mt-16 sm:mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <MotionCard key={f.title} asStaggerItem innerClassName="p-6">
              <div
                className="grid h-10 w-10 place-items-center rounded-lg mb-5 border border-white/[0.08] bg-white/[0.04]"
              >
                <f.icon className="h-[18px] w-[18px] text-foreground/85" strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-[15px] tracking-[-0.02em]">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </MotionCard>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

function InteractiveDemo() {
  const { expr, setExpr, mode, setMode, loading, error, result, solveNow, clearError } =
    useMathSolver();

  return (
    <section className="section-saas">
      <div className="container-wide">
        <Reveal className="mb-12 sm:mb-16">
          <SectionHeader
            eyebrow="Try it"
            title="An interactive demo, right here."
          />
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 surface-elevated p-6 sm:p-7"
          >
            <label className="eyebrow !text-muted-foreground">Expression</label>
            <input
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && solveNow()}
              className="input-saas mt-3"
            />
            <div className="mt-4">
              <ModeToggle mode={mode} onChange={setMode} disabled={loading} />
            </div>

            {error && (
              <div className="mt-4">
                <SolverError message={error} onRetry={solveNow} onDismiss={clearError} />
              </div>
            )}

            {result && (
              <div className="mt-6 space-y-2">
                <div className="eyebrow !text-muted-foreground">Detected rules</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {result.detectedRules.map((r) => (
                    <span key={r} className="badge text-[11px]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="lg:col-span-3 surface-elevated p-6 sm:p-7 relative min-h-[300px]"
          >
            <div className="eyebrow !text-muted-foreground">Result</div>
            <AnimatePresence mode="wait">
              {loading && !result ? (
                <SolverLoader key="loader" />
              ) : result ? (
                <motion.div
                  key={`result-${expr}-${mode}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 relative">
                    <AnimatePresence>
                      {loading && (
                        <motion.div
                          key="overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-10 rounded-xl bg-background/50 backdrop-blur-sm flex items-center justify-center"
                        >
                          <SolverLoader label="Updating…" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <EquationTransition equationKey={`${expr}-${mode}-${result.resultLatex}`}>
                      <div className="overflow-x-auto">
                        <MathLatex tex={result.resultLatex} size="xl" glow displayMode />
                      </div>
                    </EquationTransition>
                  </div>
                  <div className="mt-6 max-h-[420px] overflow-y-auto pr-1">
                    <StepByStepSolution
                      steps={result.steps}
                      solutionKey={`demo-${expr}-${mode}`}
                      compact
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-sm text-muted-foreground"
                >
                  Enter an expression to see the result.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TutorPreview() {
  return (
    <section className="section-saas border-t border-white/[0.04]">
      <div className="container-wide grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        <Reveal>
          <SectionHeader
            eyebrow="AI Tutor"
            title="A patient teacher, available 24/7."
            description="Ask about the chain rule, integration by parts, or why we add +C. Your tutor explains the why, not just the what."
          />
          <Link
            to="/tutor"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground/90 hover:text-foreground transition-colors group"
          >
            Try the tutor
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="gradient-border">
            <div className="surface-elevated p-5 sm:p-6 space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md border border-white/[0.08] bg-white/[0.06] px-4 py-3 text-sm">
                  Why does ∫ 1/x give ln|x| and not x⁰/0?
                </div>
              </div>
              <div className="flex gap-2">
                <div
                  className="h-7 w-7 shrink-0 rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                />
                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/[0.06] bg-black/30 px-4 py-3 text-sm leading-relaxed">
                  Great question. The power rule{" "}
                  <MathLatex tex={`\\int x^n dx = \\frac{x^{n+1}}{n+1}`} /> divides by <em>n+1</em>,
                  which fails when <em>n = −1</em>. So we use the natural log instead…
                </div>
              </div>
              <div className="flex gap-2">
                <div
                  className="h-7 w-7 shrink-0 rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                />
                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/[0.06] bg-black/40 px-4 py-3 text-sm font-mono text-muted-foreground">
                  ∫ 1/x dx = ln|x| + C
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GraphPreview() {
  const terms = parse("x^3 - 3x");
  const deriv = parse("3x^2 - 3");
  return (
    <section className="section-saas">
      <div className="container-wide">
        <Reveal className="mb-10 sm:mb-14">
          <SectionHeader eyebrow="Visualize" title="Functions, in motion." />
        </Reveal>
        <div className="surface-elevated p-2 sm:p-3 overflow-hidden">
        <GraphPlot
          height={420}
          series={[
            { label: "f(x) = x³ − 3x", terms, color: "oklch(0.72 0.22 240)" },
            { label: "f'(x) = 3x² − 3", terms: deriv, color: "oklch(0.7 0.27 295)" },
          ]}
        />
        </div>
      </div>
    </section>
  );
}

const QUOTES = [
  {
    name: "Maya Chen",
    role: "MIT undergrad",
    text: "Honestly the cleanest math tool I've used. The step explanations feel like a real tutor.",
  },
  {
    name: "Daniel Park",
    role: "AP Calc teacher",
    text: "I project this in class. The animated graphs make limits and derivatives finally click.",
  },
  {
    name: "Sofia Alvarez",
    role: "Engineering student",
    text: "Replaced three apps. The rule detection alone is worth it.",
  },
];

function Testimonials() {
  return (
    <section className="section-saas border-t border-white/[0.04]">
      <div className="container-wide">
        <Reveal className="mb-12 sm:mb-16">
          <SectionHeader title="Loved by curious minds." />
        </Reveal>
        <StaggerGrid className="grid gap-4 md:grid-cols-3">
          {QUOTES.map((q) => (
            <MotionCard key={q.name} asStaggerItem innerClassName="p-6">
              <Quote className="h-5 w-5 text-neon-purple" />
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{q.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <motion.div
                  className="h-9 w-9 rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                  whileHover={{ scale: 1.08 }}
                />
                <div>
                  <div className="text-sm font-medium">{q.name}</div>
                  <div className="text-xs text-muted-foreground">{q.role}</div>
                </div>
              </div>
            </MotionCard>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
