import { motion, useReducedMotion } from "framer-motion";
import { Sigma } from "lucide-react";

export function SolverLoader({ label = "Computing with SymPy…" }: { label?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center gap-5 py-10"
      role="status"
      aria-live="polite"
    >
      <div className="relative grid h-[4.5rem] w-[4.5rem] place-items-center">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-neon-purple/50"
          animate={
            reduce
              ? undefined
              : { scale: [1, 1.4, 1], opacity: [0.8, 0.1, 0.8], rotate: [0, 180, 360] }
          }
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-2 rounded-full border border-neon-cyan/40"
          animate={reduce ? undefined : { scale: [1.15, 0.9, 1.15], opacity: [0.35, 0.95, 0.35] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
        />
        <motion.span
          className="absolute inset-4 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, oklch(0.72 0.22 240), oklch(0.7 0.27 295), oklch(0.85 0.16 200), oklch(0.72 0.22 240))",
            opacity: 0.35,
          }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="relative grid h-11 w-11 place-items-center rounded-xl"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-sm)" }}
          animate={reduce ? undefined : { rotate: [0, 6, -6, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sigma className="h-5 w-5 text-primary-foreground" />
        </motion.div>
      </div>

      <motion.p
        className="text-sm text-muted-foreground tracking-wide"
        animate={reduce ? undefined : { opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {label}
      </motion.p>

      <div className="w-48 h-1 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full w-1/2 rounded-full origin-left"
          style={{ background: "var(--gradient-primary)" }}
          animate={reduce ? undefined : { scaleX: [0.2, 1, 0.2], x: ["-20%", "120%", "-20%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="flex gap-1.5">
        {[0, 0.12, 0.24].map((d) => (
          <motion.span
            key={d}
            className="h-1.5 w-1.5 rounded-full bg-neon-purple"
            animate={reduce ? undefined : { opacity: [0.2, 1, 0.2], y: [0, -4, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.85, delay: d, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}
