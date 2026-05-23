import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MathLatex } from "@/components/math/MathLatex";
import type { Step } from "@/lib/solver";

const stepVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2 } },
};

export function StepByStepSolution({
  steps,
  solutionKey,
  compact = false,
}: {
  steps: Step[];
  /** Changes when expression/mode changes — retriggers step animation */
  solutionKey: string;
  compact?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (!steps.length) return;

    const timers: number[] = [];
    steps.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setVisibleCount((c) => Math.max(c, i + 1));
        }, i * 140 + 80),
      );
    });

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [solutionKey, steps]);

  return (
    <ol className={compact ? "space-y-2" : "space-y-2.5"}>
      <AnimatePresence mode="popLayout">
        {steps.slice(0, visibleCount).map((s, i) => (
          <motion.li
            key={`${solutionKey}-${i}-${s.rule}`}
            custom={i}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            whileHover={{ x: 4, transition: { duration: 0.2 } }}
            className="group flex items-start gap-3 rounded-lg border border-transparent bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08] transition-colors p-3"
          >
            <motion.div
              layout
              className={`grid shrink-0 place-items-center rounded-md border border-white/[0.08] bg-white/[0.05] text-foreground/80 ${
                compact ? "h-6 w-6 text-[11px] font-semibold" : "h-7 w-7 text-xs font-semibold"
              }`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 22, delay: i * 0.08 }}
            >
              {i + 1}
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.05 }}
                  className="rounded-md bg-neon-blue/15 border border-neon-blue/30 px-2 py-0.5 text-neon-cyan font-medium"
                >
                  {s.rule}
                </motion.span>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.1 }}
                className={`mt-1.5 text-muted-foreground leading-relaxed ${compact ? "text-xs" : "text-sm"}`}
              >
                {s.detail}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.18, duration: 0.35 }}
                className="mt-2.5 overflow-x-auto rounded-lg bg-black/40 border border-neon-purple/15 px-3 py-3 shadow-[inset_0_0_24px_oklch(0.7_0.27_295_/_0.06)]"
              >
                <MathLatex tex={s.latex} displayMode size="base" />
              </motion.div>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>

      {visibleCount < steps.length && (
        <motion.li
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground"
        >
          <span className="flex gap-1">
            {[0, 0.2, 0.4].map((d) => (
              <motion.span
                key={d}
                className="h-1.5 w-1.5 rounded-full bg-neon-purple"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.9, delay: d, repeat: Infinity }}
              />
            ))}
          </span>
          Building next step…
        </motion.li>
      )}
    </ol>
  );
}
